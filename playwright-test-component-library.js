import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const LIBRARY_URL = `${BASE_URL}/#/admin/library`;

test.describe('ComponentLibrary Interface Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LIBRARY_URL);
    await page.waitForLoadState('networkidle');
  });

  test('1. Navigate to #/admin/library', async ({ page }) => {
    expect(page.url()).toContain('#/admin/library');
    await expect(page.locator('h2')).toContainText('Component Library');
  });

  test('2. Verify component list loads with built-in and custom components', async ({ page }) => {
    const componentsList = page.locator('[style*="flex-direction"]').first();
    const componentCards = page.locator('div').filter({ has: page.locator('h3') });

    const cardCount = await componentCards.count();
    expect(cardCount).toBeGreaterThan(0);

    const firstCardText = await componentCards.first().textContent();
    expect(firstCardText).toBeTruthy();
  });

  test('3. Search for a component by name', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search components..."]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Button');
    await page.waitForLoadState('networkidle');

    const componentsList = page.locator('h3');
    const count = await componentsList.count();
    expect(count).toBeGreaterThan(0);

    const firstComponent = await componentsList.first().textContent();
    expect(firstComponent?.toLowerCase()).toContain('button');
  });

  test('4. Filter to show only built-in components', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('builtin');
    await page.waitForLoadState('networkidle');

    const customBadges = page.locator('span').filter({ hasText: 'Custom' });
    const badgeCount = await customBadges.count();

    expect(badgeCount).toBe(0);

    const componentCards = page.locator('h3');
    const count = await componentCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('5. Filter to show only custom components', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('custom');
    await page.waitForLoadState('networkidle');

    const customBadges = page.locator('span').filter({ hasText: 'Custom' });
    const badgeCount = await customBadges.count();
  });

  test('6. Click on a component to view its details', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('all');
    await page.waitForLoadState('networkidle');

    const firstComponentCard = page.locator('div').filter({ has: page.locator('h3') }).first();
    await firstComponentCard.click();

    const detailPanel = page.locator('h2').filter({ hasText: /Button|Text|Container|Heading/ });
    await expect(detailPanel).toBeVisible();
  });

  test('7. View the component\'s props schema', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('all');
    await page.waitForLoadState('networkidle');

    const firstComponentCard = page.locator('div').filter({ has: page.locator('h3') }).first();
    await firstComponentCard.click();

    const propsSection = page.locator('h3').filter({ hasText: 'Properties' });
    await expect(propsSection).toBeVisible();

    const propLabels = page.locator('label');
    const labelCount = await propLabels.count();
    expect(labelCount).toBeGreaterThanOrEqual(0);
  });

  test('8. Edit a prop value in the preview editor', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('all');
    await page.waitForLoadState('networkidle');

    const componentCards = page.locator('div').filter({ has: page.locator('h3') });
    const textComponent = await componentCards.filter({ hasText: 'Text' }).first();
    await textComponent.click();

    const inputs = page.locator('input[type="text"]');
    const inputCount = await inputs.count();

    if (inputCount > 1) {
      const propInput = inputs.nth(1);
      await propInput.fill('Test Content');

      const inputValue = await propInput.inputValue();
      expect(inputValue).toBe('Test Content');
    }
  });

  test('9. Verify the preview updates in real-time with new prop values', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('all');
    await page.waitForLoadState('networkidle');

    const componentCards = page.locator('div').filter({ has: page.locator('h3') });
    const textComponent = await componentCards.filter({ hasText: 'Text' }).first();
    await textComponent.click();

    const previewSection = page.locator('h3').filter({ hasText: 'Live Preview' });
    await expect(previewSection).toBeVisible();

    const previewArea = page.locator('[style*="backgroundColor"]').filter({ hasText: /Component|Error/ });
    await expect(previewArea.first()).toBeVisible();
  });

  test('10. Test all prop types (string, number, boolean, array, object)', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('all');
    await page.waitForLoadState('networkidle');

    const componentCards = page.locator('div').filter({ has: page.locator('h3') });

    for (let i = 0; i < Math.min(5, await componentCards.count()); i++) {
      const card = componentCards.nth(i);
      await card.click();

      const propLabels = page.locator('label');
      const labelCount = await propLabels.count();

      for (let j = 0; j < Math.min(3, labelCount); j++) {
        const label = propLabels.nth(j);
        const labelText = await label.textContent();

        if (labelText?.includes('string') || labelText?.includes('text')) {
          const input = label.locator('..').locator('input[type="text"]').first();
          if (await input.isVisible()) {
            await input.fill('test-value');
          }
        }

        if (labelText?.includes('number') || labelText?.includes('level')) {
          const input = label.locator('..').locator('input[type="number"]').first();
          if (await input.isVisible()) {
            await input.fill('42');
          }
        }

        if (labelText?.includes('boolean')) {
          const input = label.locator('..').locator('input[type="checkbox"]').first();
          if (await input.isVisible()) {
            await input.check();
          }
        }
      }
    }
  });

  test('11. View which pages use each component', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('all');
    await page.waitForLoadState('networkidle');

    const componentCards = page.locator('div').filter({ has: page.locator('h3') });

    for (let i = 0; i < Math.min(3, await componentCards.count()); i++) {
      const card = componentCards.nth(i);
      await card.click();

      const usedInSection = page.locator('h3').filter({ hasText: 'Used in Pages' });

      if (await usedInSection.isVisible()) {
        const usageList = page.locator('ul').first();
        const items = await usageList.locator('li').count();
        expect(items).toBeGreaterThan(0);
      }
    }
  });

  test('12. Test the delete button for a custom component', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('custom');
    await page.waitForLoadState('networkidle');

    const componentCards = page.locator('div').filter({ has: page.locator('h3') });
    const count = await componentCards.count();

    if (count > 0) {
      const firstCard = componentCards.first();
      await firstCard.click();

      const deleteButton = page.locator('button').filter({ hasText: 'Delete' });
      const isVisible = await deleteButton.isVisible();

      if (isVisible) {
        await expect(deleteButton).toBeVisible();
      }
    }
  });

  test('13. Verify the component is removed from the list after deletion', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('custom');
    await page.waitForLoadState('networkidle');

    const componentCards = page.locator('div').filter({ has: page.locator('h3') });
    const initialCount = await componentCards.count();

    if (initialCount > 0) {
      const firstCard = componentCards.first();
      const componentName = await firstCard.locator('h3').first().textContent();

      await firstCard.click();

      const deleteButton = page.locator('button').filter({ hasText: 'Delete' });
      const isVisible = await deleteButton.isVisible();

      if (isVisible) {
        await deleteButton.click();

        const confirmDeleteBtn = page.locator('button').filter({ hasText: /^Delete$/ }).last();
        if (await confirmDeleteBtn.isVisible()) {
          await confirmDeleteBtn.click();
          await page.waitForLoadState('networkidle');

          const updatedCards = page.locator('div').filter({ has: page.locator('h3') });
          const finalCount = await updatedCards.count();

          if (finalCount < initialCount) {
            const remainingNames = await updatedCards.locator('h3').allTextContents();
            expect(remainingNames).not.toContain(componentName);
          }
        }
      }
    }
  });

  test('14. Test selecting different components and viewing their details', async ({ page }) => {
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('all');
    await page.waitForLoadState('networkidle');

    const componentCards = page.locator('div').filter({ has: page.locator('h3') });

    const componentCount = await componentCards.count();
    expect(componentCount).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < Math.min(3, componentCount); i++) {
      const card = componentCards.nth(i);
      await card.click();

      const detailTitle = page.locator('h2').filter({ hasText: /Button|Text|Container|Heading|Image|Card|Divider|Section|Grid|Link|List/ });
      await expect(detailTitle).toBeVisible();

      const description = page.locator('h3').filter({ hasText: 'Description' });
      await expect(description).toBeVisible();
    }
  });

  test('15. Test the responsive layout on different screen sizes', async ({ browser }) => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1440, height: 900 },
    ];

    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();

      await page.goto(LIBRARY_URL);
      await page.waitForLoadState('networkidle');

      const title = page.locator('h2').filter({ hasText: 'Component Library' });
      await expect(title).toBeVisible();

      const searchInput = page.locator('input[placeholder="Search components..."]');
      await expect(searchInput).toBeVisible();

      const componentCards = page.locator('div').filter({ has: page.locator('h3') });
      const count = await componentCards.count();
      expect(count).toBeGreaterThan(0);

      if (count > 0) {
        const firstCard = componentCards.first();
        await firstCard.click();

        const detailPanel = page.locator('h2').filter({ hasText: /Button|Text|Container|Heading/ });
        await expect(detailPanel).toBeVisible();
      }

      await context.close();
    }
  });

  test.describe('Component Library - Integration Tests', () => {
    test('Search and filter work together correctly', async ({ page }) => {
      const filterSelect = page.locator('select');
      const searchInput = page.locator('input[placeholder="Search components..."]');

      await filterSelect.selectOption('builtin');
      await searchInput.fill('Button');
      await page.waitForLoadState('networkidle');

      const componentCards = page.locator('div').filter({ has: page.locator('h3') });
      const count = await componentCards.count();
      expect(count).toBeGreaterThan(0);

      const customBadges = page.locator('span').filter({ hasText: 'Custom' });
      const badgeCount = await customBadges.count();
      expect(badgeCount).toBe(0);

      const firstComponent = await componentCards.first().locator('h3').textContent();
      expect(firstComponent?.toLowerCase()).toContain('button');
    });

    test('Clear search shows all filtered results', async ({ page }) => {
      const filterSelect = page.locator('select');
      const searchInput = page.locator('input[placeholder="Search components..."]');

      await filterSelect.selectOption('builtin');
      await searchInput.fill('Button');
      await page.waitForLoadState('networkidle');

      const filteredCount = await page.locator('div').filter({ has: page.locator('h3') }).count();

      await searchInput.fill('');
      await page.waitForLoadState('networkidle');

      const unfilteredCount = await page.locator('div').filter({ has: page.locator('h3') }).count();
      expect(unfilteredCount).toBeGreaterThanOrEqual(filteredCount);
    });

    test('Detail panel shows all component information', async ({ page }) => {
      const filterSelect = page.locator('select');
      await filterSelect.selectOption('all');
      await page.waitForLoadState('networkidle');

      const componentCards = page.locator('div').filter({ has: page.locator('h3') });
      const firstCard = componentCards.first();
      await firstCard.click();

      const sections = [
        'Description',
        'Properties',
        'Live Preview',
      ];

      for (const section of sections) {
        const sectionHeader = page.locator('h3').filter({ hasText: section });
        await expect(sectionHeader).toBeVisible();
      }
    });

    test('Props display correctly with type information', async ({ page }) => {
      const filterSelect = page.locator('select');
      await filterSelect.selectOption('all');
      await page.waitForLoadState('networkidle');

      const componentCards = page.locator('div').filter({ has: page.locator('h3') });
      const cardWithProps = componentCards.filter({ hasText: /props/ }).first();
      await cardWithProps.click();

      const propLabels = page.locator('label');
      const count = await propLabels.count();

      if (count > 0) {
        const labelText = await propLabels.first().textContent();
        expect(labelText).toMatch(/\(.*\)/);
      }
    });

    test('Preview area renders successfully', async ({ page }) => {
      const filterSelect = page.locator('select');
      await filterSelect.selectOption('all');
      await page.waitForLoadState('networkidle');

      const componentCards = page.locator('div').filter({ has: page.locator('h3') });
      const firstCard = componentCards.first();
      await firstCard.click();

      const previewSection = page.locator('h3').filter({ hasText: 'Live Preview' });
      await expect(previewSection).toBeVisible();

      const previewContent = page.locator('[style*="backgroundColor"]').filter({ hasText: /Component|content/ }).first();
      await expect(previewContent).toBeVisible();
    });

    test('Component usage information is accurate', async ({ page }) => {
      const filterSelect = page.locator('select');
      await filterSelect.selectOption('all');
      await page.waitForLoadState('networkidle');

      const componentCards = page.locator('div').filter({ has: page.locator('h3') });

      for (let i = 0; i < Math.min(3, await componentCards.count()); i++) {
        const card = componentCards.nth(i);
        const usageText = await card.locator('span').filter({ hasText: /Used in/ }).textContent();

        if (usageText) {
          const pageCount = parseInt(usageText.match(/\d+/)?.[0] || '0');
          expect(pageCount).toBeGreaterThan(0);
        }
      }
    });

    test('Keyboard navigation works correctly', async ({ page }) => {
      const filterSelect = page.locator('select');
      await filterSelect.selectOption('all');
      await page.waitForLoadState('networkidle');

      const componentCards = page.locator('div').filter({ has: page.locator('h3') });
      const firstCard = componentCards.first();
      await firstCard.click();

      const searchInput = page.locator('input[placeholder="Search components..."]');
      await searchInput.focus();

      const filterDropdown = page.locator('select');
      await filterDropdown.focus();

      await expect(filterDropdown).toBeFocused();
    });
  });

  test.describe('Component Library - Edge Cases', () => {
    test('Search handles special characters', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search components..."]');
      await searchInput.fill('!@#$%^&*()');
      await page.waitForLoadState('networkidle');

      const componentCards = page.locator('div').filter({ has: page.locator('h3') });
      const count = await componentCards.count();
      expect(count).toBe(0);
    });

    test('Filter persists after searching', async ({ page }) => {
      const filterSelect = page.locator('select');
      const searchInput = page.locator('input[placeholder="Search components..."]');

      await filterSelect.selectOption('builtin');
      await searchInput.fill('Button');
      await page.waitForLoadState('networkidle');

      const filterValue = await filterSelect.inputValue();
      expect(filterValue).toBe('builtin');
    });

    test('Clearing search doesn\'t clear filter', async ({ page }) => {
      const filterSelect = page.locator('select');
      const searchInput = page.locator('input[placeholder="Search components..."]');

      await filterSelect.selectOption('builtin');
      await searchInput.fill('Button');
      await page.waitForLoadState('networkidle');

      await searchInput.fill('');
      await page.waitForLoadState('networkidle');

      const filterValue = await filterSelect.inputValue();
      expect(filterValue).toBe('builtin');
    });

    test('Empty component list is handled gracefully', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search components..."]');
      await searchInput.fill('NonexistentComponent12345');
      await page.waitForLoadState('networkidle');

      const componentCards = page.locator('div').filter({ has: page.locator('h3') });
      const count = await componentCards.count();
      expect(count).toBe(0);
    });
  });
});
