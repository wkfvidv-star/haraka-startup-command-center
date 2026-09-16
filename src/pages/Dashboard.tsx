import { useAppStore } from '../store';
import { FounderWorkspace } from '../components/workspace/FounderWorkspace';
import { LeadershipWorkspace } from '../components/workspace/LeadershipWorkspace';
import { ScientificWorkspace } from '../components/workspace/ScientificWorkspace';
import { TechWorkspace } from '../components/workspace/TechWorkspace';
import { LegalWorkspace } from '../components/workspace/LegalWorkspace';
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader';
import { Card, CardContent } from '../components/ui/card';
import { BookOpen } from 'lucide-react';

function GuestWorkspace() {
  return (
    <div className="space-y-8 max-w-screen-xl">
      <WorkspaceHeader />
      <Card className="border-dashed">
        <CardContent className="pt-12 pb-12 text-center flex flex-col items-center gap-4">
          <BookOpen className="w-12 h-12 text-slate-700" />
          <p className="text-slate-400">لم يتم التعرف على حسابك. يرجى التواصل مع رئيس المشروع.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function Dashboard() {
  const currentUserRole = useAppStore(state => state.currentUserRole);

  switch (currentUserRole) {
    case 'FOUNDER':    return <FounderWorkspace />;
    case 'LEADERSHIP': return <LeadershipWorkspace />;
    case 'SCIENTIFIC': return <ScientificWorkspace />;
    case 'TECH':       return <TechWorkspace />;
    case 'LEGAL':      return <LegalWorkspace />;
    default:           return <GuestWorkspace />;
  }
}
