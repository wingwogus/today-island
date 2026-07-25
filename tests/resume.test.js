const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")

const resumePagePath = path.join(__dirname, "../src/pages/resume.tsx")

test("provides a native scrollable resume page with the core resume sections", () => {
  assert.equal(
    fs.existsSync(resumePagePath),
    true,
    "src/pages/resume.tsx should expose the resume at /resume"
  )

  const resumePage = fs.readFileSync(resumePagePath, "utf8")

  for (const section of [
    "Profile",
    "Representative Projects",
    "ChamChamCham (2M | 5명) BE/Infra",
    "NuguSauce (1M | 1명) 개인프로젝트",
    "OSS Contributions",
    "포트폴리오 경진대회",
    "Skills",
    "TRI-BE",
  ]) {
    assert.ok(resumePage.includes(section), `missing resume content: ${section}`)
  }

  assert.match(resumePage, /jsonLd/)
  assert.doesNotMatch(resumePage, /<iframe/i)
})
