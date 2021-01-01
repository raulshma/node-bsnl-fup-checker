const puppeteer = require('puppeteer');
const { PendingXHR } = require('pending-xhr-puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const pendingXHR = new PendingXHR(page);
  await page.goto('https://fuptopup.bsnl.co.in/manualRedirection.do', {
    waitUntil: 'networkidle0',
  });
  await page.click('button[name=btnKnowUsages]');
  await pendingXHR.waitForAllXhrFinished();
  const data = await page.evaluate(() => {
    const tds = Array.from(
      document.querySelectorAll('#knowUsagesGrid tr:nth-child(2) td')
    );
    return tds.map((td) => td.innerText);
  });
  const totalUsed = parseFloat(data[3]);
  const used = parseFloat(data[4]);
  console.table({
    Plan: data[1],
    'Total Used': totalUsed,
    'Used Today': used,
    'Total Used (Mb)': formatNum(totalUsed * 1024),
    'Used (Mb)': formatNum(used * 1024),
  });
  await browser.close();
})();

const formatNum = (num) =>
  num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
