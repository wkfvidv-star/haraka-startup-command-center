import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';

import { Dashboard } from './pages/Dashboard';
import { Today } from './pages/Today';
import { CompanyStatus } from './pages/CompanyStatus';
import { Roadmap } from './pages/Roadmap';
import { Tasks } from './pages/Tasks';
import { Projects } from './pages/Projects';
import { ProductReadiness } from './pages/ProductReadiness';
import { LaunchControl } from './pages/LaunchControl';
import { Incubation } from './pages/Incubation';
import { Finance } from './pages/Finance';
import { Risks } from './pages/Risks';
import { Decisions } from './pages/Decisions';
import { KPIs } from './pages/KPIs';

// Phase 3 Pages
import { MarketIntelligence } from './pages/MarketIntelligence';
import { Leads } from './pages/Leads';
import { Pipeline } from './pages/Pipeline';
import { Pilots } from './pages/Pilots';
import { Customers } from './pages/Customers';
import { Offers } from './pages/Offers';
import { Marketing } from './pages/Marketing';
import { Content } from './pages/Content';
import { Partnerships } from './pages/Partnerships';
import { RevenuePage as Revenue } from './pages/Revenue';

// Phase 4 Pages
import { Executive } from './pages/Executive';
import { Goals } from './pages/Goals';
import { Initiatives } from './pages/Initiatives';
import { Growth } from './pages/Growth';
import { CompanyHealth } from './pages/CompanyHealth';
import { Team } from './pages/Team';
import { Performance } from './pages/Performance';

// Phase 5 Pages
import { FinancialControl } from './pages/FinancialControl';
import { FinancialScenarios } from './pages/FinancialScenarios';
import { Allocations } from './pages/Allocations';
import { FundingMilestones } from './pages/FundingMilestones';

// Phase 6 Pages
import { Governance } from './pages/Governance';
import { Obligations } from './pages/Obligations';
import { Documents } from './pages/Documents';
import { ContractsIP } from './pages/ContractsIP';
import { Meetings } from './pages/Meetings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="today" element={<Today />} />
            <Route path="executive" element={<Executive />} />
            
            <Route path="status" element={<CompanyStatus />} />
            <Route path="goals" element={<Goals />} />
            <Route path="initiatives" element={<Initiatives />} />
            <Route path="growth" element={<Growth />} />
            <Route path="company-health" element={<CompanyHealth />} />
            
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="projects" element={<Projects />} />
            <Route path="product" element={<ProductReadiness />} />
            <Route path="launch" element={<LaunchControl />} />
            
            <Route path="market" element={<MarketIntelligence />} />
            <Route path="leads" element={<Leads />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="pilots" element={<Pilots />} />
            <Route path="customers" element={<Customers />} />
            <Route path="offers" element={<Offers />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="content" element={<Content />} />
            <Route path="partnerships" element={<Partnerships />} />
            <Route path="revenue" element={<Revenue />} />
            
            <Route path="team" element={<Team />} />
            <Route path="performance" element={<Performance />} />
            <Route path="finance" element={<Finance />} />
            {/* Phase 5 */}
            <Route path="financial-control" element={<FinancialControl />} />
            <Route path="financial-scenarios" element={<FinancialScenarios />} />
            <Route path="allocations" element={<Allocations />} />
            <Route path="funding-milestones" element={<FundingMilestones />} />
            <Route path="risks" element={<Risks />} />
            <Route path="decisions" element={<Decisions />} />
            <Route path="kpis" element={<KPIs />} />
            
            {/* Phase 6 */}
            <Route path="governance" element={<Governance />} />
            <Route path="obligations" element={<Obligations />} />
            <Route path="documents" element={<Documents />} />
            <Route path="contracts-ip" element={<ContractsIP />} />
            <Route path="meetings" element={<Meetings />} />
            
            <Route path="incubation" element={<Incubation />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
