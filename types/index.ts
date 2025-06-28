export interface ClientData {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number; // 1-5
  RequestedTaskIDs: string; // comma-separated string
  GroupTag: string;
  AttributesJSON: string; // JSON string
}

export interface WorkerData {
  WorkerID: string;
  WorkerName: string;
  Skills: string; // comma-separated string
  AvailableSlots: string; // comma-separated numbers
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: number;
}

export interface TaskData {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number; // number of phases
  RequiredSkills: string; // comma-separated string
  PreferredPhases: string; // list or range syntax
  MaxConcurrent: number;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export interface Rule {
  id: string;
  type: 'coRun' | 'slotRestriction' | 'loadLimit' | 'phaseWindow' | 'patternMatch';
  description: string;
  parameters: any;
  enabled: boolean;
  createdAt: Date;
}

export interface CoRunRule extends Rule {
  type: 'coRun';
  parameters: {
    taskIds: string[];
  };
}

export interface SlotRestrictionRule extends Rule {
  type: 'slotRestriction';
  parameters: {
    group: string;
    minCommonSlots: number;
  };
}

export interface LoadLimitRule extends Rule {
  type: 'loadLimit';
  parameters: {
    workerGroup: string;
    maxSlotsPerPhase: number;
  };
}

export interface OptimizationWeights {
  priorityLevel: number;
  taskFulfillment: number;
  fairness: number;
  efficiency: number;
  workloadBalance: number;
}

export interface UploadStatus {
  clients?: 'uploading' | 'success' | 'error' | 'idle';
  workers?: 'uploading' | 'success' | 'error' | 'idle';
  tasks?: 'uploading' | 'success' | 'error' | 'idle';
}

export interface DataSet {
  clients: ClientData[];
  workers: WorkerData[];
  tasks: TaskData[];
}

export interface ProcessedData extends DataSet {
  validationErrors: {
    clients: ValidationError[];
    workers: ValidationError[];
    tasks: ValidationError[];
    crossReference: ValidationError[];
  };
}