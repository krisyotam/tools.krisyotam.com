"use client"

import { useState } from "react"

interface StatusEntry {
  code: number
  name: string
  description: string
}

const STATUS_CODES: StatusEntry[] = [
  // 1xx Informational
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body." },
  { code: 101, name: "Switching Protocols", description: "The server is switching protocols as requested by the client via the Upgrade header." },
  { code: 102, name: "Processing", description: "The server has received and is processing the request, but no response is available yet." },
  { code: 103, name: "Early Hints", description: "Used to return some response headers before the final HTTP message." },
  // 2xx Success
  { code: 200, name: "OK", description: "The request succeeded. The meaning depends on the HTTP method used." },
  { code: 201, name: "Created", description: "The request succeeded and a new resource was created as a result." },
  { code: 202, name: "Accepted", description: "The request has been received but not yet acted upon. It is non-committal." },
  { code: 203, name: "Non-Authoritative Information", description: "The returned metadata is from a local or third-party copy, not the origin server." },
  { code: 204, name: "No Content", description: "The server successfully processed the request and is not returning any content." },
  { code: 205, name: "Reset Content", description: "The server successfully processed the request and asks the client to reset the document view." },
  { code: 206, name: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client." },
  { code: 207, name: "Multi-Status", description: "Conveys information about multiple resources in situations where multiple status codes might be appropriate." },
  { code: 208, name: "Already Reported", description: "Used inside a DAV: propstat response to avoid enumerating the same collection members repeatedly." },
  { code: 226, name: "IM Used", description: "The server has fulfilled a GET request and the response is a representation of one or more instance-manipulations applied to the current instance." },
  // 3xx Redirection
  { code: 300, name: "Multiple Choices", description: "The request has more than one possible response. The user or user agent should choose one." },
  { code: 301, name: "Moved Permanently", description: "The URL of the requested resource has been changed permanently. The new URL is given in the response." },
  { code: 302, name: "Found", description: "The URI of the requested resource has been changed temporarily. Further changes may be made in the future." },
  { code: 303, name: "See Other", description: "The server sent this response to direct the client to get the requested resource at another URI with a GET request." },
  { code: 304, name: "Not Modified", description: "Used for caching purposes. The response has not been modified, so the client can continue to use the cached version." },
  { code: 305, name: "Use Proxy", description: "The requested resource must be accessed through the proxy given by the Location field. Deprecated." },
  { code: 307, name: "Temporary Redirect", description: "The server sends this response to direct the client to get the requested resource at another URI with the same method." },
  { code: 308, name: "Permanent Redirect", description: "The resource is now permanently located at another URI, specified by the Location header. Same method must be used." },
  // 4xx Client Error
  { code: 400, name: "Bad Request", description: "The server cannot or will not process the request due to something perceived to be a client error." },
  { code: 401, name: "Unauthorized", description: "The client must authenticate itself to get the requested response." },
  { code: 402, name: "Payment Required", description: "Reserved for future use. Originally created for digital payment systems." },
  { code: 403, name: "Forbidden", description: "The client does not have access rights to the content. Unlike 401, the server knows the client's identity." },
  { code: 404, name: "Not Found", description: "The server cannot find the requested resource. The URL is not recognized." },
  { code: 405, name: "Method Not Allowed", description: "The request method is known by the server but is not supported by the target resource." },
  { code: 406, name: "Not Acceptable", description: "The server cannot produce a response matching the list of acceptable values defined in the request headers." },
  { code: 407, name: "Proxy Authentication Required", description: "Authentication is needed to be done by a proxy." },
  { code: 408, name: "Request Timeout", description: "The server timed out waiting for the request." },
  { code: 409, name: "Conflict", description: "The request conflicts with the current state of the server." },
  { code: 410, name: "Gone", description: "The content has been permanently deleted from the server, with no forwarding address." },
  { code: 411, name: "Length Required", description: "The server rejected the request because the Content-Length header field is not defined." },
  { code: 412, name: "Precondition Failed", description: "The client indicated preconditions in its headers which the server does not meet." },
  { code: 413, name: "Payload Too Large", description: "The request entity is larger than limits defined by the server." },
  { code: 414, name: "URI Too Long", description: "The URI requested by the client is longer than the server is willing to interpret." },
  { code: 415, name: "Unsupported Media Type", description: "The media format of the requested data is not supported by the server." },
  { code: 416, name: "Range Not Satisfiable", description: "The range specified by the Range header field cannot be fulfilled." },
  { code: 417, name: "Expectation Failed", description: "The expectation indicated by the Expect request header field cannot be met by the server." },
  { code: 418, name: "I'm a Teapot", description: "The server refuses to brew coffee because it is, permanently, a teapot. (RFC 2324)" },
  { code: 421, name: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response." },
  { code: 422, name: "Unprocessable Content", description: "The request was well-formed but was unable to be followed due to semantic errors." },
  { code: 423, name: "Locked", description: "The resource that is being accessed is locked." },
  { code: 424, name: "Failed Dependency", description: "The request failed due to failure of a previous request." },
  { code: 425, name: "Too Early", description: "The server is unwilling to risk processing a request that might be replayed." },
  { code: 426, name: "Upgrade Required", description: "The server refuses to perform the request using the current protocol but might after the client upgrades." },
  { code: 428, name: "Precondition Required", description: "The origin server requires the request to be conditional." },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time (rate limiting)." },
  { code: 431, name: "Request Header Fields Too Large", description: "The server is unwilling to process the request because its header fields are too large." },
  { code: 451, name: "Unavailable For Legal Reasons", description: "The user agent requested a resource that cannot legally be provided." },
  // 5xx Server Error
  { code: 500, name: "Internal Server Error", description: "The server has encountered a situation it does not know how to handle." },
  { code: 501, name: "Not Implemented", description: "The request method is not supported by the server and cannot be handled." },
  { code: 502, name: "Bad Gateway", description: "The server, acting as a gateway, got an invalid response from the upstream server." },
  { code: 503, name: "Service Unavailable", description: "The server is not ready to handle the request. Common causes are maintenance or overload." },
  { code: 504, name: "Gateway Timeout", description: "The server is acting as a gateway and cannot get a response in time from the upstream server." },
  { code: 505, name: "HTTP Version Not Supported", description: "The HTTP version used in the request is not supported by the server." },
  { code: 506, name: "Variant Also Negotiates", description: "The server has an internal configuration error: transparent content negotiation results in a circular reference." },
  { code: 507, name: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request." },
  { code: 508, name: "Loop Detected", description: "The server detected an infinite loop while processing the request." },
  { code: 510, name: "Not Extended", description: "Further extensions to the request are required for the server to fulfill it." },
  { code: 511, name: "Network Authentication Required", description: "The client needs to authenticate to gain network access (captive portal)." },
]

const GROUPS: { label: string; range: [number, number] }[] = [
  { label: "1xx Informational", range: [100, 199] },
  { label: "2xx Success", range: [200, 299] },
  { label: "3xx Redirection", range: [300, 399] },
  { label: "4xx Client Error", range: [400, 499] },
  { label: "5xx Server Error", range: [500, 599] },
]

export function HttpStatusCodesTool() {
  const [query, setQuery] = useState("")

  const filtered = STATUS_CODES.filter(s => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      String(s.code).includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Search</label>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by code, name, or description..."
          />
        </div>
      </div>

      {GROUPS.map(group => {
        const codes = filtered.filter(s => s.code >= group.range[0] && s.code <= group.range[1])
        if (codes.length === 0) return null
        return (
          <div className="tool-section" key={group.label}>
            <p className="tool-section-title">{group.label}</p>
            {codes.map(s => (
              <div className="tool-output-row" key={s.code} style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {s.code} {s.name}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {s.description}
                </span>
              </div>
            ))}
          </div>
        )
      })}

      {filtered.length === 0 && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          No matching status codes found.
        </p>
      )}
    </div>
  )
}
