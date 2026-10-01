import emailIcon from "../assets/social/email.svg"
import linkedinIcon from "../assets/social/linkedin.svg"
import githubIcon from "../assets/social/github.png"
import xIcon from "../assets/social/x.png"

export type SocialLink = {
  name: string
  url: string
  icon: string
  value: string
}

export const social: SocialLink[] = [
  { name: "Email", url: "mailto:wsalasmayl363@gmail.com", icon: emailIcon, value: "wsalasmayl363@gmail.com" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/wesal-ismail-410372330/",
    icon: linkedinIcon,
    value: "wesal ismail"
  },
  {
    name: "GitHub",
    url: "https://github.com/we2004",
    icon: githubIcon,
    value: "we2004"
  },
  {
    name: "X",
    url: "https://twitter.com/w9esal",
    icon: xIcon,
    value: "w9esal"
  }
]
