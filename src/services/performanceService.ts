import { Task } from '../types/task';
import { Project } from '../types/project';
import { TeamMember } from '../types/team';
import { TeamPerformance } from '../types/companyHealth';
import { isPast } from 'date-fns';

export function calculateCompletionRate(completed: number, assigned: number): number {
  if (assigned === 0) return 0;
  return Math.max(0, Math.min(100, Math.round((completed / assigned) * 100)));
}

export function calculateOverdueRate(overdue: number, assigned: number): number {
  if (assigned === 0) return 0;
  return Math.max(0, Math.min(100, Math.round((overdue / assigned) * 100)));
}

export function calculateWorkload(activeTasks: number, activeProjects: number): number {
  return activeTasks + activeProjects;
}

export function getMemberPerformance(
  member: TeamMember, 
  tasks: Task[], 
  projects: Project[]
): TeamPerformance {
  const memberTasks = tasks.filter(t => t.owner === member.name); // Using name as owner for simplicity in demo
  
  const assignedTasks = memberTasks.length;
  const completedTasks = memberTasks.filter(t => t.status === 'Done').length;
  const blockedTasks = memberTasks.filter(t => t.status === 'Blocked').length;
  const overdueTasks = memberTasks.filter(t => t.status !== 'Done' && isPast(new Date(t.deadline))).length;
  
  const activeTasks = memberTasks.filter(t => t.status === 'Todo' || t.status === 'In Progress' || t.status === 'Blocked').length;
  const activeProjects = projects.filter(p => p.owner === member.name && p.status === 'Active').length;

  return {
    memberId: member.id,
    assignedTasks,
    completedTasks,
    overdueTasks,
    blockedTasks,
    completionRate: calculateCompletionRate(completedTasks, assignedTasks),
    overdueRate: calculateOverdueRate(overdueTasks, assignedTasks),
    workload: calculateWorkload(activeTasks, activeProjects)
  };
}

export function getTeamPerformance(
  members: TeamMember[], 
  tasks: Task[], 
  projects: Project[]
): TeamPerformance[] {
  return members.map(m => getMemberPerformance(m, tasks, projects));
}
