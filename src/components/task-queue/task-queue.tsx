
export class TaskQueue {

    private static tasksToExecute: (() => Promise<any>)[] = [];

    constructor(private concurrentJobs: number, private waitTimeInMs: number){
        console.log(TaskQueue.tasksToExecute);
        this.run();
    }

    addTask(fn: () => Promise<any>) {
        console.log('addedTask');
        TaskQueue.tasksToExecute.push(fn);
    }

    run() {
        console.log('executed ', TaskQueue.tasksToExecute.length);
        const task = TaskQueue.tasksToExecute.pop();
        console.log('popped ', TaskQueue.tasksToExecute.length);
        if(task) {
            console.log('executing task')
            task().then((response) => {
                console.log('run in 200ms');
                setTimeout(() => this.run(), this.waitTimeInMs);
            })
        } else {
            console.log('executing else');
            setTimeout(() => this.run(), this.waitTimeInMs);
        }
            
        
    }

}