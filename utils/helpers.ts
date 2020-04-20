export const formatNumber = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
}

export const clusterStyle = (casesPerMil) => {
    const backgroundColor = casesPerMil < 50 ? "#347C03"
                : casesPerMil < 100 ? "#DDEF2B"
                : casesPerMil < 1000 ? "#F0932C"
                : "#AF3014"

    const size = casesPerMil < 50 ? "30"
                : casesPerMil < 100 ? "40"
                : casesPerMil < 1000 ? "60"
                : "90"
    
    const fontSize = casesPerMil < 50 ? "10"
                : casesPerMil < 100 ? "15"
                : casesPerMil < 1000 ? "20"
                : "25"

    return { backgroundColor, size, fontSize }
}

export const groupByCritical = (casesPerMil) => {
    const category = casesPerMil < 50 ? "Minor"
    : casesPerMil < 100 ? "Moderate"
    : casesPerMil < 1000 ? "Considerable"
    : "Critical"

    return category
}