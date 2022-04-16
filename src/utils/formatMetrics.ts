import dayjs from "dayjs"

export default function formatMetrics(metrics: any){
    const transactions = formatDates(metrics.transactions)
    const recharges = formatDates(metrics.recharges)
    
    return {
        balance: metrics.balance,
        transactions,
        recharges
    }
}

function formatDates (objects:[]){
    return objects.map( (object:any) => {
        return{
            ...object,
            timestamp: dayjs(object.timestamp).format("DD/MM/YYYY"),
        }
    })
}