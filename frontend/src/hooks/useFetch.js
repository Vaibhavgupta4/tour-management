import { useEffect, useState } from "react";


const useFetch = (url) => {

    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
  
    useEffect(() => {
        const fetchData = async() => {
            setLoading(true)
            try {
                const res = await fetch(url)
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
                }
                const result = await res.json()
                setData(result.data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [url])
    return {
        data, error, loading,
    }
}

export default useFetch