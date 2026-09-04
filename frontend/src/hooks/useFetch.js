import { useEffect, useState } from "react";

const useFetch = (url, options = {}) => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // allow callers to pass custom fetch options (e.g. headers)
    const optsKey = JSON.stringify(options)

    useEffect(() => {
        if (!url) return
        let cancelled = false
        const controller = new AbortController()

        const fetchData = async() => {
            setLoading(true)
            setError(null)
            try {
                // attach token automatically if present (covers protected routes in prod)
                let token = null
                try { token = localStorage.getItem('accessToken') } catch {}
                const headers = { ...(options.headers || {}) }
                if (token && !headers.Authorization) headers.Authorization = `Bearer ${token}`

                const res = await fetch(url, {
                    credentials: 'include',
                    signal: controller.signal,
                    ...options,
                    headers,
                })
                if (!res.ok) {
                    // try to surface API message
                    let msg = `Failed to fetch: ${res.status} ${res.statusText}`
                    try { const j = await res.clone().json(); if (j?.message) msg = j.message } catch {}
                    throw new Error(msg)
                }
                const result = await res.json()
                if (!cancelled) setData(result.data)
            } catch (err) {
                if (err.name === 'AbortError') return
                if (!cancelled) setError(err.message)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        fetchData()
        return () => { cancelled = true; controller.abort() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, optsKey])

    return { data, error, loading }
}

export default useFetch