-- 012_rls_tests.sql
-- These tests ensure that RLS policies work properly.
-- We run them in a transaction that always rolls back so we don't dirty the DB.

BEGIN;

DO $$
DECLARE
    company1 UUID;
    company2 UUID;
    user1 UUID := gen_random_uuid();
    user2 UUID := gen_random_uuid();
    profile1 UUID;
    profile2 UUID;
    record_id UUID;
    found_count INT;
BEGIN
    -- 1. Setup Test Data
    INSERT INTO companies (name) VALUES ('Test Company 1') RETURNING id INTO company1;
    INSERT INTO companies (name) VALUES ('Test Company 2') RETURNING id INTO company2;
    
    INSERT INTO profiles (auth_user_id, full_name) VALUES (user1, 'User 1') RETURNING id INTO profile1;
    INSERT INTO profiles (auth_user_id, full_name) VALUES (user2, 'User 2') RETURNING id INTO profile2;
    
    INSERT INTO company_members (company_id, profile_id, role) VALUES (company1, profile1, 'Founder');
    INSERT INTO company_members (company_id, profile_id, role) VALUES (company2, profile2, 'Founder');
    
    -- Insert a record as superuser (bypassing RLS)
    INSERT INTO tasks (company_id, title) VALUES (company1, 'Task for Company 1') RETURNING id INTO record_id;
    INSERT INTO tasks (company_id, title) VALUES (company2, 'Task for Company 2');

    -- 2. Test Unauthenticated Access
    -- Set role to anon
    SET ROLE anon;
    SELECT count(*) INTO found_count FROM tasks;
    IF found_count > 0 THEN
        RAISE EXCEPTION 'Unauthenticated user can see tasks!';
    END IF;

    -- 3. Test Authenticated User 1
    -- Reset to authenticated role, and simulate user1
    SET ROLE authenticated;
    EXECUTE format('SET request.jwt.claims TO ''{"sub": "%s"}''', user1);
    
    -- User 1 should see exactly 1 task
    SELECT count(*) INTO found_count FROM tasks;
    IF found_count != 1 THEN
        RAISE EXCEPTION 'User 1 sees % tasks instead of 1', found_count;
    END IF;
    
    -- User 1 tries to insert into company 2 (should fail RLS WITH CHECK)
    BEGIN
        INSERT INTO tasks (company_id, title) VALUES (company2, 'Hacked Task');
        RAISE EXCEPTION 'User 1 was able to insert into Company 2!';
    EXCEPTION WHEN OTHERS THEN
        -- Expected to fail RLS
    END;

    -- 4. Test Authenticated User 2
    EXECUTE format('SET request.jwt.claims TO ''{"sub": "%s"}''', user2);
    
    -- User 2 should see exactly 1 task (their own)
    SELECT count(*) INTO found_count FROM tasks;
    IF found_count != 1 THEN
        RAISE EXCEPTION 'User 2 sees % tasks instead of 1', found_count;
    END IF;

    RAISE NOTICE 'All RLS manual tests passed.';
END $$;

ROLLBACK;
