export const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount)
} 