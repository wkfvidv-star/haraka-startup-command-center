export interface IncubationPhase {
  id: string;
  name: string;
  currentObjective: string;
  startDate: string;
  targetLaunchDate: string;
  nextMilestone: string;
}

export type DeliverableStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  status: DeliverableStatus;
  dueDate: string;
  owner: string;
  documentUrl?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  attendees: string;
  notes: string;
}

export type NewDeliverable = Omit<Deliverable, 'id'>;
export type NewMeeting = Omit<Meeting, 'id'>;
