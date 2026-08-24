from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    # Click "Begin Reading" to go to chapters
    begin = page.locator('text=Begin Reading')
    if begin.count() > 0:
        begin.click()
        page.wait_for_timeout(2000)
        page.screenshot(path='screenshot_chapters.png', full_page=True)
        print("Chapters page screenshot saved")

        # Click first chapter
        ch = page.locator('text=石神的早晨')
        if ch.count() > 0:
            ch.first.click()
            page.wait_for_timeout(3000)
            page.screenshot(path='screenshot_reading.png', full_page=True)
            print("Reading page screenshot saved")
        else:
            print("No chapter found")
    else:
        print("No Begin Reading button found")

    browser.close()
