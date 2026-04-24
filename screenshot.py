from playwright.sync_api import sync_playwright
import os

SHOT_DIR = "D:/ClaudeCode2.0/novel2/demo-shots"
os.makedirs(SHOT_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    # 1. Start screen
    page.goto("http://localhost:3005")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)
    page.screenshot(path=f"{SHOT_DIR}/01-start.png")

    # Click start button
    page.locator("#start-button").click()
    page.wait_for_timeout(3000)

    # 2. First scene (with image)
    page.screenshot(path=f"{SHOT_DIR}/02-scene.png")

    # Wait for typing to finish then take another
    page.wait_for_timeout(5000)
    page.screenshot(path=f"{SHOT_DIR}/03-scene-typed.png")

    # 3. Evidence tab
    page.locator("#nav-tab-evidence").click()
    page.wait_for_timeout(1500)
    page.screenshot(path=f"{SHOT_DIR}/04-evidence.png")

    # 4. Suspects tab
    page.locator("#nav-tab-suspects").click()
    page.wait_for_timeout(1500)
    page.screenshot(path=f"{SHOT_DIR}/05-suspects.png")

    # 5. Timeline tab
    page.locator("#nav-tab-timeline").click()
    page.wait_for_timeout(1500)
    page.screenshot(path=f"{SHOT_DIR}/06-timeline.png")

    # 6. Relations tab
    page.locator("#nav-tab-relations").click()
    page.wait_for_timeout(1500)
    page.screenshot(path=f"{SHOT_DIR}/07-relations.png")

    # 7. Navigate to act 2 scene for variety - go to a later scene
    page.locator("#nav-tab-scene").click()
    page.wait_for_timeout(500)
    # Use JS to jump to a specific scene
    page.evaluate("window.__jumpToScene && window.__jumpToScene('investigation_start')")
    # If that doesn't work, we'll just skip
    page.wait_for_timeout(3000)
    page.screenshot(path=f"{SHOT_DIR}/08-act2-scene.png")

    browser.close()
    print(f"Screenshots saved to {SHOT_DIR}")
