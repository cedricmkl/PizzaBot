export const formatTagName = (name: string): string => {
    return name.toLowerCase().trim().replace(/ /g, "-")
}