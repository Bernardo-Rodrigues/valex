export function formatEmployeeName(employee: string) {
    const names = employee.split(" ");

    const cardholderName = names.map( (name, i) => {
        if(i === 0 || i === names.length - 1) return name.toUpperCase()
        if(name.length > 2) return name[0].toUpperCase()
    }).join(" ").split("  ").join(" ")

    return cardholderName;
}