
interface ITask<T> {
    promiseResolve: (value: T | PromiseLike<T>) => void;
    task: () => Promise<any>
}

export class TaskQueue {

    private static tasksToExecute: ITask<any>[] = [];

    constructor(private concurrentJobs: number, private waitTimeInMs: number){
        this.run();
    }

    addTask<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise<T>(resolve => {
            TaskQueue.tasksToExecute.push({task: fn, promiseResolve: resolve});
        })
        
    }

    run() {
        const taskWrapper = TaskQueue.tasksToExecute.pop();
        if(taskWrapper) {
            taskWrapper.task().then((response) => {
                setTimeout(() => this.run(), this.waitTimeInMs);
                taskWrapper.promiseResolve(response);
            })
        } else {
            setTimeout(() => this.run(), this.waitTimeInMs);
        }
            
        
    }

}