-- 013_onboarding_rpc.sql

-- Secure Onboarding RPC to create Profile, Company, and Founder Membership
-- Uses SECURITY DEFINER to bypass table RLS, but strictly enforces data ownership based on auth.uid()
CREATE OR REPLACE FUNCTION create_company_onboarding(
    company_name text,
    full_name text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id uuid;
    new_profile_id uuid;
    new_company_id uuid;
    result json;
BEGIN
    -- 1. Get authenticated user ID
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 2. Check if profile already exists for this user
    SELECT id INTO new_profile_id FROM profiles WHERE auth_user_id = current_user_id;

    -- 3. Create profile if it does not exist
    IF new_profile_id IS NULL THEN
        INSERT INTO profiles (auth_user_id, full_name)
        VALUES (current_user_id, full_name)
        RETURNING id INTO new_profile_id;
    END IF;

    -- 4. Check if user is already a member of any company
    IF EXISTS (
        SELECT 1 FROM company_members WHERE profile_id = new_profile_id
    ) THEN
        RAISE EXCEPTION 'User already belongs to a company. Cannot create a new one via onboarding.';
    END IF;

    -- 5. Create the new company
    INSERT INTO companies (name)
    VALUES (company_name)
    RETURNING id INTO new_company_id;

    -- 6. Create the founder membership
    INSERT INTO company_members (company_id, profile_id, role)
    VALUES (new_company_id, new_profile_id, 'Founder');

    -- 7. Return success result
    result := json_build_object(
        'company_id', new_company_id,
        'profile_id', new_profile_id
    );

    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        -- If any error occurs, the entire block is rolled back automatically by Postgres
        RAISE;
END;
$$;
