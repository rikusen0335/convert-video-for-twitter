export function getLocationOrigin() {
    if (typeof window !== 'undefined') {
        const {
            protocol,
            hostname,
            port
        } = window.location

        return `${protocol}//${hostname}${port ? ':' + port : ''}`
    }
}
