import { ClientData, WorkerData, TaskData, ValidationError } from '@/types';

export class ValidationEngine {
  validateClients(clients: ClientData[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // 1. Missing required columns
    clients.forEach((client, idx) => {
      if (!client.ClientID) {
        errors.push({
          row: idx,
          field: 'ClientID',
          message: 'Missing required ClientID',
          severity: 'error'
        });
      }

      if (!client.PriorityLevel || client.PriorityLevel < 1 || client.PriorityLevel > 5) {
        errors.push({
          row: idx,
          field: 'PriorityLevel',
          message: 'PriorityLevel must be between 1-5',
          severity: 'error',
          suggestion: 'Use values 1 (lowest) to 5 (highest)'
        });
      }

      if (!client.ClientName) {
        errors.push({
          row: idx,
          field: 'ClientName',
          message: 'ClientName is required',
          severity: 'error'
        });
      }

      if (!client.GroupTag) {
        errors.push({
          row: idx,
          field: 'GroupTag',
          message: 'GroupTag is required for resource allocation',
          severity: 'warning'
        });
      }
    });

    // 2. Duplicate ClientIDs
    const clientIds = clients.map(c => c.ClientID).filter(Boolean);
    const duplicateIds = clientIds.filter((id, idx) => clientIds.indexOf(id) !== idx);
    const uniqueDuplicates = Array.from(new Set(duplicateIds));
    
    uniqueDuplicates.forEach(duplicateId => {
      const indices = clients.map((client, idx) => client.ClientID === duplicateId ? idx : -1).filter(i => i !== -1);
      indices.forEach(idx => {
        errors.push({
          row: idx,
          field: 'ClientID',
          message: `Duplicate ClientID: ${duplicateId}`,
          severity: 'error',
          suggestion: 'Each client must have a unique identifier'
        });
      });
    });

    // 3. Malformed RequestedTaskIDs
    clients.forEach((client, idx) => {
      if (client.RequestedTaskIDs) {
        const taskIds = client.RequestedTaskIDs.split(',').map(id => id.trim());
        const invalidIds = taskIds.filter(id => !id.match(/^[A-Za-z0-9_-]+$/));
        
        if (invalidIds.length > 0) {
          errors.push({
            row: idx,
            field: 'RequestedTaskIDs',
            message: `Invalid task ID format: ${invalidIds.join(', ')}`,
            severity: 'error',
            suggestion: 'Use alphanumeric characters, underscores, and hyphens only'
          });
        }
      }
    });

    // 4. Invalid AttributesJSON
    clients.forEach((client, idx) => {
      if (client.AttributesJSON) {
        try {
          JSON.parse(client.AttributesJSON);
        } catch (e) {
          errors.push({
            row: idx,
            field: 'AttributesJSON',
            message: 'Invalid JSON format in AttributesJSON',
            severity: 'error',
            suggestion: 'Ensure valid JSON syntax: {"key": "value"}'
          });
        }
      }
    });

    // 5. Priority distribution analysis
    const priorityCounts = [1, 2, 3, 4, 5].map(p => clients.filter(c => c.PriorityLevel === p).length);
    const totalClients = clients.length;
    
    if (totalClients > 0) {
      const highPriorityPercent = (priorityCounts[4] + priorityCounts[3]) / totalClients;
      if (highPriorityPercent > 0.7) {
        errors.push({
          row: -1,
          field: 'PriorityLevel',
          message: 'Over 70% of clients have high priority (4-5). Consider redistributing priorities.',
          severity: 'warning',
          suggestion: 'Balance priority levels for better resource allocation'
        });
      }
    }

    return errors;
  }

  validateWorkers(workers: WorkerData[]): ValidationError[] {
    const errors: ValidationError[] = [];

    workers.forEach((worker, idx) => {
      // 1. Required fields
      if (!worker.WorkerID) {
        errors.push({
          row: idx,
          field: 'WorkerID',
          message: 'Missing required WorkerID',
          severity: 'error'
        });
      }

      if (!worker.WorkerName) {
        errors.push({
          row: idx,
          field: 'WorkerName',
          message: 'WorkerName is required',
          severity: 'error'
        });
      }

      // 2. Skills validation
      if (!worker.Skills) {
        errors.push({
          row: idx,
          field: 'Skills',
          message: 'At least one skill must be specified',
          severity: 'error'
        });
      }

      // 3. Available slots validation
      if (worker.AvailableSlots) {
        const slots = worker.AvailableSlots.split(',').map(s => parseInt(s.trim()));
        const invalidSlots = slots.filter(slot => isNaN(slot) || slot < 1);
        
        if (invalidSlots.length > 0) {
          errors.push({
            row: idx,
            field: 'AvailableSlots',
            message: 'Available slots must be positive integers',
            severity: 'error',
            suggestion: 'Use comma-separated numbers: 1,2,3'
          });
        }
      }

      // 4. Load capacity validation
      if (!worker.MaxLoadPerPhase || worker.MaxLoadPerPhase < 1) {
        errors.push({
          row: idx,
          field: 'MaxLoadPerPhase',
          message: 'MaxLoadPerPhase must be at least 1',
          severity: 'error'
        });
      }

      // 5. Qualification level validation
      if (worker.QualificationLevel && (worker.QualificationLevel < 1 || worker.QualificationLevel > 10)) {
        errors.push({
          row: idx,
          field: 'QualificationLevel',
          message: 'QualificationLevel should be between 1-10',
          severity: 'warning',
          suggestion: 'Use 1 (junior) to 10 (expert) scale'
        });
      }
    });

    // 6. Duplicate WorkerIDs
    const workerIds = workers.map(w => w.WorkerID).filter(Boolean);
    const duplicateIds = workerIds.filter((id, idx) => workerIds.indexOf(id) !== idx);
    const uniqueDuplicates = Array.from(new Set(duplicateIds));
    
    uniqueDuplicates.forEach(duplicateId => {
      const indices = workers.map((worker, idx) => worker.WorkerID === duplicateId ? idx : -1).filter(i => i !== -1);
      indices.forEach(idx => {
        errors.push({
          row: idx,
          field: 'WorkerID',
          message: `Duplicate WorkerID: ${duplicateId}`,
          severity: 'error'
        });
      });
    });

    return errors;
  }

  validateTasks(tasks: TaskData[]): ValidationError[] {
    const errors: ValidationError[] = [];

    tasks.forEach((task, idx) => {
      // 1. Required fields
      if (!task.TaskID) {
        errors.push({
          row: idx,
          field: 'TaskID',
          message: 'Missing required TaskID',
          severity: 'error'
        });
      }

      if (!task.TaskName) {
        errors.push({
          row: idx,
          field: 'TaskName',
          message: 'TaskName is required',
          severity: 'error'
        });
      }

      // 2. Duration validation
      if (!task.Duration || task.Duration < 1) {
        errors.push({
          row: idx,
          field: 'Duration',
          message: 'Duration must be at least 1 phase',
          severity: 'error'
        });
      }

      // 3. Required skills validation
      if (!task.RequiredSkills) {
        errors.push({
          row: idx,
          field: 'RequiredSkills',
          message: 'At least one required skill must be specified',
          severity: 'error'
        });
      }

      // 4. Preferred phases validation
      if (task.PreferredPhases) {
        const phases = task.PreferredPhases.toString();
        
        // Check for range syntax (e.g., "1-5")
        if (phases.includes('-')) {
          const rangeParts = phases.split('-');
          if (rangeParts.length !== 2 || rangeParts.some(p => isNaN(parseInt(p.trim())))) {
            errors.push({
              row: idx,
              field: 'PreferredPhases',
              message: 'Invalid range format. Use "start-end" (e.g., "1-5")',
              severity: 'error'
            });
          }
        } else {
          // Check for comma-separated list
          const phaseNumbers = phases.split(',').map(p => parseInt(p.trim()));
          const invalidPhases = phaseNumbers.filter(p => isNaN(p) || p < 1);
          
          if (invalidPhases.length > 0) {
            errors.push({
              row: idx,
              field: 'PreferredPhases',
              message: 'Preferred phases must be positive integers',
              severity: 'error',
              suggestion: 'Use comma-separated numbers or range: "1,2,3" or "1-5"'
            });
          }
        }
      }

      // 5. Max concurrent validation
      if (task.MaxConcurrent && task.MaxConcurrent < 1) {
        errors.push({
          row: idx,
          field: 'MaxConcurrent',
          message: 'MaxConcurrent must be at least 1',
          severity: 'error'
        });
      }

      // 6. Category validation
      if (!task.Category) {
        errors.push({
          row: idx,
          field: 'Category',
          message: 'Task category helps with organization and rules',
          severity: 'warning'
        });
      }
    });

    // 7. Duplicate TaskIDs
    const taskIds = tasks.map(t => t.TaskID).filter(Boolean);
    const duplicateTaskIds = taskIds.filter((id, idx) => taskIds.indexOf(id) !== idx);
    const uniqueDuplicateTasks = Array.from(new Set(duplicateTaskIds));
    
    uniqueDuplicateTasks.forEach(duplicateId => {
      const indices = tasks.map((task, idx) => task.TaskID === duplicateId ? idx : -1).filter(i => i !== -1);
      errors.push({
        row: indices[0],
        field: 'TaskID',
        message: `Duplicate TaskID found: ${duplicateId}`,
        severity: 'error',
        suggestion: 'Each task must have a unique identifier'
      });
    });

    return errors;
  }

  validateCrossReferences(clients: ClientData[], workers: WorkerData[], tasks: TaskData[]): ValidationError[] {
    const errors: ValidationError[] = [];

    const taskIds = new Set(tasks.map(t => t.TaskID).filter(Boolean));
    const workerSkills = new Set(workers.flatMap(w => w.Skills?.split(',').map(s => s.trim()) || []));
    const requiredSkills = new Set(tasks.flatMap(t => t.RequiredSkills?.split(',').map(s => s.trim()) || []));

    // 1. Check if requested tasks exist
    clients.forEach((client, clientIdx) => {
      if (client.RequestedTaskIDs) {
        const requestedIds = client.RequestedTaskIDs.split(',').map(id => id.trim());
        const missingTasks = requestedIds.filter(id => !taskIds.has(id));
        
        if (missingTasks.length > 0) {
          errors.push({
            row: clientIdx,
            field: 'RequestedTaskIDs',
            message: `Referenced tasks not found: ${missingTasks.join(', ')}`,
            severity: 'error',
            suggestion: 'Ensure all referenced task IDs exist in the tasks file'
          });
        }
      }
    });

    // 2. Check skill coverage
    const missingSkills = [...requiredSkills].filter(skill => !workerSkills.has(skill));
    if (missingSkills.length > 0) {
      errors.push({
        row: -1,
        field: 'Skills',
        message: `No workers have these required skills: ${missingSkills.join(', ')}`,
        severity: 'warning',
        suggestion: 'Consider adding workers with these skills or updating task requirements'
      });
    }

    // 3. Workload capacity analysis
    const totalTaskLoad = tasks.reduce((sum, task) => sum + (task.Duration || 0), 0);
    const totalWorkerCapacity = workers.reduce((sum, worker) => {
      const availableSlots = worker.AvailableSlots?.split(',').length || 0;
      return sum + (availableSlots * (worker.MaxLoadPerPhase || 0));
    }, 0);

    if (totalTaskLoad > totalWorkerCapacity * 0.8) {
      errors.push({
        row: -1,
        field: 'Capacity',
        message: 'Total task load may exceed worker capacity. Consider adding more workers or reducing task scope.',
        severity: 'warning',
        suggestion: `Current load: ${totalTaskLoad}, Available capacity: ${totalWorkerCapacity}`
      });
    }

    // Check for requested tasks that don't exist
    const allTaskIds = new Set(tasks.map(t => t.TaskID));
    clients.forEach((client, index) => {
      if (client.RequestedTaskIDs) {
        const requestedIds = client.RequestedTaskIDs.split(',').map(id => id.trim());
        const invalidIds = requestedIds.filter(id => !allTaskIds.has(id));
        if (invalidIds.length > 0) {
          errors.push({
            row: index,
            field: 'RequestedTaskIDs',
            message: `Client requests non-existent TaskIDs: ${invalidIds.join(', ')}`,
            severity: 'error',
            suggestion: 'Ensure all requested task IDs exist in the tasks file'
          });
        }
      }
    });

    return errors;
  }
}