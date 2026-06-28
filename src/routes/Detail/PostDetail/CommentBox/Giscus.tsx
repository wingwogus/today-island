import styled from "@emotion/styled"
import { useEffect } from "react"
import { CONFIG } from "site.config"
import useScheme from "src/hooks/useScheme"
import {
  buildGiscusScriptAttributes,
  isGiscusConfigReady,
} from "./giscusConfig"

type Props = {
  postId: string
}

const Giscus: React.FC<Props> = ({ postId }) => {
  const [scheme] = useScheme()

  useEffect(() => {
    const anchor = document.getElementById("giscus-comments")
    if (!anchor || !isGiscusConfigReady(CONFIG.giscus.config)) return

    const script = document.createElement("script")
    const attrs = buildGiscusScriptAttributes(CONFIG.giscus.config, {
      postId,
      theme: scheme,
    })

    Object.entries(attrs).forEach(([key, value]) => {
      script.setAttribute(key, value)
    })

    anchor.appendChild(script)

    return () => {
      anchor.innerHTML = ""
    }
  }, [postId, scheme])

  return <StyledWrapper id="giscus-comments" />
}

export default Giscus

const StyledWrapper = styled.div`
  margin-top: 2.5rem;
`
