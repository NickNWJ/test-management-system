const TestRun = require('../models/testRun');
const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const { PDFDocument, rgb } = require('pdf-lib');
const assert = require('assert');
const fs = require('fs');


// Controller for creating a new test run
// Controller for creating a new test run
async function createTestRun(req, res) {
  try {
    const { automationTestScript } = req.body;

    if (!automationTestScript) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Execute the Selenium test script
    const testRunRes = await executeSeleniumTest(automationTestScript);

    // Return the test result to the frontend
    res.status(200).json({ testResult: testRunRes });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid data' });
  }
}

async function updateTestRun(req, res) {
  try {
    const {
      name,
      description,
      status,
      dateUpdated,
      createdBy,
      executionTimeTaken,
      testCase,
      automationTestScript,
      testResult,
      logs
    } = req.body;

    const testRunId = req.params.id;
    const updatedTestRun = await TestRun.findByIdAndUpdate(
      testRunId,
      {
        name,
        description,
        status,
        dateUpdated,
        createdBy,
        executionTimeTaken,
        testCase,
        automationTestScript,
        testResult,
        logs
      },
      { new: true }
    );

    if (!updatedTestRun) {
      return res.status(404).json({ error:  error.message});
    }

    res.json(updatedTestRun);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error:  error.message  });
  }
}

async function getAllTestRuns(req, res) {
  try {
    const testRuns = await TestRun.find();
    res.json(testRuns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function executeSeleniumTest(script) {
  let automationTestScript = first.concat('\n',script).concat('\n',last);
  try {
      // Start message
      console.log(`Starting and waiting for script to complete...`);

      // Run and waiting for test scriptto be executed
      testRunRes = await eval(automationTestScript);

      // Continue
      console.log(`Finished!`);

    console.log('Selenium test executed successfully');
  } catch (error) {
    console.error('An error occurred during test execution:', error);
    throw error; // Rethrow the error to handle it outside the function
  }
  // return test result to frontend
  return testRunRes;
}

  // User input from the text field
  const userInput = `
  (async function example() {
    let pdfDoc, filePath, pdfBytes, testId, totalScriptLines, totalPassed, totalFailed;
    try {
      const driver = await new Builder().forBrowser('chrome').build();
      const scriptSteps = [
        {
          name: 'Accessing UTrust local home page',
          action: async () => {
            await driver.get('http://localhost:3000/');
          },
          message: 'UTrust Home Accessed',
          status: 'Passed',
          timeout: 2000,
        },
        {
          name: 'Accessing UTrust Login Page',
          action: async () => {
            await driver.get('http://localhost:3000/login');
          },
          message: 'UTrust Login Accessed',
          status: 'Passed',
          timeout: 2000,
        },
        {
          name: 'Entering email',
          action: async () => {
            const emailInput = await driver.findElement(By.css('input[placeholder="Enter your email"]'));
            await emailInput.sendKeys('uarehup@gmail.com');
          },
          message: 'Email entered',
          status: 'Passed',
        },
        {
          name: 'Entering password',
          action: async () => {
            const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
            await passwordInput.sendKeys('123456');
          },
          message: 'Password entered',
          status: 'Passed',
        },
        {
          name: 'Clicking login button',
          action: async () => {
            const loginButton = await driver.findElement(By.xpath('//button[text()="Log In"]'));
            await loginButton.click();
          },
          message: 'Login button clicked',
          status: 'Passed',
          timeout: 2000,
        },
        {
          name: 'Clicking open menu button',
          action: async () => {
            const openMenuElement = await driver.findElement(By.xpath('//*[@id="root"]/div/nav/div[1]/button'));
            await openMenuElement.click();
          },
          message: 'Open menu button clicked',
          status: 'Passed',
          timeout: 5000,
        },
        {
          name: 'Clicking logout button',
          action: async () => {
            const logoutButton = await driver.findElement(By.xpath('//a[text()="Logout"]'));
            await logoutButton.click();
          },
          message: 'Logout button clicked',
          status: 'Passed',
          timeout: 2000,
        },
      ];
      
      
      pdfDoc = await PDFDocument.create();
      // Add the first page to the document
      const firstPage = pdfDoc.addPage();
        
      // Add the test case ID and description at the top of the first page
      testId = "1234";
      description = "UTrust Login";
      totalScriptLines = scriptSteps.length;
      totalPassed = 0; // Replace with the actual count of tests passed
      totalFailed = 0; // Replace with the actual count of tests failed
      
      for (let i = 0; i < scriptSteps.length; i++) {
        const step = scriptSteps[i];
  
  
        try {
          // Perform the action for the step
          await Promise.race([
            step.action(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Step timeout')), step.timeout + 2000)),
          ]);
  
          step.status = 'Passed';
          console.log("["+getTimestampString()+"]"+ " Test step passed: "+step.name);
          totalPassed++;
        } catch (error) {
          console.error("["+getTimestampString()+"]"+ " Test step failed: "+step.name);
          step.status = 'Failed';
          totalFailed++;
  
          const failureMessage = "Step failed:" + step.name;
          const failureDescription = error.message;
          const failurePage = pdfDoc.addPage();
          failurePage.drawText(failureMessage, { x: 50, y: 700 - 50 * i, size: 20 });
          failurePage.drawText('Error Log -> ' + failureDescription, { x: 50, y: 700 - 50 * i - 20, size: 10 });
        }
  
        const screenshot = await driver.takeScreenshot();
  
        // Create a new page for each image and its steps
        const newPage = pdfDoc.addPage();
  
        // Set the page size based on the image dimensions
        const image = await pdfDoc.embedPng(Buffer.from(screenshot, 'base64'));
        const { width, height } = image;
  
        const padding = 20;
        const x = padding;
        const y = padding;
        const contentWidth = newPage.getWidth() - 2 * padding;
        const contentHeight = newPage.getHeight() - 2 * padding;
        const scaleFactor = Math.min(contentWidth / width, contentHeight / height);
        const scaledWidth = width * scaleFactor;
        const scaledHeight = height * scaleFactor;
        const xOffset = (contentWidth - scaledWidth) / 2;
        const yOffset = (contentHeight - scaledHeight) / 2;
  
        const isPassed = step.status === 'Passed';
        const borderColor = isPassed ? rgb(0, 1, 0) : rgb(1, 0, 0);
        newPage.drawRectangle({
          x: x + xOffset,
          y: y + yOffset,
          width: scaledWidth,
          height: scaledHeight,
          borderColor: borderColor,
          borderWidth: 2,
        });
  
        newPage.drawImage(image, {
          x: x + xOffset,
          y: y + yOffset,
          width: scaledWidth,
          height: scaledHeight,
        });
  
        const description = step.name;
        const descriptionY = y + contentHeight - 40;
        newPage.drawText('Step '+i+1+' - '+description, {
          x: x,
          y: descriptionY,
          size: 15,
        });
  
        const statusY = y + contentHeight - 20;
        newPage.drawText(step.status, {
          x: x,
          y: statusY,
          size: 15,
        });
  
        if (i !== scriptSteps.length - 1) {
          newPage.moveDown(0.5);
        }
      }
  
      const fontSize = 20;
      const margin = 20;
      firstPage.drawText('Automation Test Execution Report', {
        x: margin,
        y: firstPage.getHeight() - margin - fontSize *1,
        size: 30,
      });
      firstPage.drawText('Test Case ID: '+testId, {
        x: margin,
        y: firstPage.getHeight() - margin - fontSize *4,
        size: fontSize,
      });
      firstPage.drawText('Description: '+description, {
        x: margin,
        y: firstPage.getHeight() - margin - fontSize * 6,
        size: fontSize,
      });
      firstPage.drawText('Total Test Steps (Action) Executed: ' + totalScriptLines , {
        x: margin,
        y: firstPage.getHeight() - margin - fontSize * 8,
        size: fontSize,
      });
      firstPage.drawText('Total Tests Passed: ' + totalPassed , {
        x: margin,
        y: firstPage.getHeight() - margin - fontSize * 10,
        size: fontSize,
      });
      firstPage.drawText('Total Tests Failed: ' + totalFailed, {
        x: margin,
        y: firstPage.getHeight() - margin - fontSize * 12,
        size: fontSize,
      });
  
      pdfBytes = await pdfDoc.save();
  
      // Convert the PDF buffer to base64 data
      const pdfData = Buffer.from(pdfBytes).toString('base64');
    
      // Save the PDF to a file
      filePath = './test_report1.pdf';
  
      // Write the PDF buffer to a file
      fs.writeFileSync(filePath, pdfBytes);
      
      filePath = './test1_base64.txt';
  
      fs.writeFileSync(filePath, pdfData);
  
      console.log('PDF file written successfully:', filePath);
  
      await driver.quit();
  
      console.log('Selenium test executed successfully');
  
      if (pdfData !== null) {
        pdfExist = true;
      } else {
        pdfExist = false;
      }
  
      return await Promise.resolve({pdfData, filePath, pdfExist, totalScriptLines, totalFailed, totalPassed});
    } catch (error) {
      console.error('An error occurred during test execution:', error);
  
      if (pdfDoc) {
        const failurePage = pdfDoc.addPage();
        failurePage.drawText('Test Execution Failed', { x: 50, y: 700, size: 20 });
        failurePage.drawText(error.message, { x: 50, y: 680, size: 14 });
  
        pdfBytes = await pdfDoc.save();
  
        filePath = './test_report1.pdf';
        fs.writeFileSync(filePath, pdfBytes);
      }
    }
  })();
  
`;

let first = `(async function example() {
  let pdfDoc, filePath, pdfBytes, testId, totalScriptLines, totalPassed, totalFailed, startTime, endTime;
  try {\nstartTime = new Date().getTime()/1000`;

const script = `const driver = await new Builder().forBrowser('chrome').build();
const scriptSteps = [
  {
    name: 'Accessing UTrust local home page',
    action: async () => {
      await driver.get('http://localhost:3000/');
    },
    message: 'UTrust Home Accessed',
    status: 'Passed',
    timeout: 2000,
  },
  {
    name: 'Accessing UTrust Login Page',
    action: async () => {
      await driver.get('http://localhost:3000/login');
    },
    message: 'UTrust Login Accessed',
    status: 'Passed',
    timeout: 2000,
  },
  {
    name: 'Entering email',
    action: async () => {
      const emailInput = await driver.findElement(By.css('input[placeholder="Enter your email"]'));
      await emailInput.sendKeys('uarehup@gmail.com');
    },
    message: 'Email entered',
    status: 'Passed',
    timeout: 3000,
  },
  {
    name: 'Entering password',
    action: async () => {
      const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
      await passwordInput.sendKeys('123456');
    },
    message: 'Password entered',
    status: 'Passed',
    timeout: 3000,
  },
  {
    name: 'Clicking login button',
    action: async () => {
      const loginButton = await driver.findElement(By.xpath('//button[text()="Log In"]'));
      await loginButton.click();
    },
    message: 'Login button clicked',
    status: 'Passed',
    timeout: 8000,
  },
  {
    name: 'Clicking open menu button',
    action: async () => {
      const openMenuElement = await driver.findElement(By.xpath('//*[@id="root"]/div/nav/div[1]/button'));
      await openMenuElement.click();
    },
    message: 'Open menu button clicked',
    status: 'Passed',
    timeout: 8000,
  },
  {
    name: 'Clicking logout button',
    action: async () => {
      const logoutButton = await driver.findElement(By.xpath('//a[text()="Log out"]'));
      await logoutButton.click();
    },
    message: 'Logout button clicked',
    status: 'Passed',
  },
];
`;

let last = `pdfDoc = await PDFDocument.create();
// Add the first page to the document
const firstPage = pdfDoc.addPage();
  
// Add the test case ID and description at the top of the first page
testId = "1234";
description = "UTrust Login";
totalScriptLines = scriptSteps.length;
totalPassed = 0; // Replace with the actual count of tests passed
totalFailed = 0; // Replace with the actual count of tests failed

for (let i = 0; i < scriptSteps.length; i++) {
  const step = scriptSteps[i];


  try {
    // Perform the action for the step
    await Promise.race([
      step.action(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Step timeout')), step.timeout + 2000)),
    ]);

    step.status = 'Passed';
    console.log("["+getTimestampString()+"]"+ " Test step passed: "+step.name);
    totalPassed++;
  } catch (error) {
    console.error("["+getTimestampString()+"]"+ " Test step failed: "+step.name);
    step.status = 'Failed';
    totalFailed++;

    const failureMessage = "Step failed:" + step.name;
    const failureDescription = error.message;
    const failurePage = pdfDoc.addPage();
    failurePage.drawText(failureMessage, { x: 50, y: 700 - 50 * i, size: 20 });
    failurePage.drawText('Error Log -> ' + failureDescription, { x: 50, y: 700 - 50 * i - 20, size: 10 });
  }

  const screenshot = await driver.takeScreenshot();

  // Create a new page for each image and its steps
  const newPage = pdfDoc.addPage();

  // Set the page size based on the image dimensions
  const image = await pdfDoc.embedPng(Buffer.from(screenshot, 'base64'));
  const { width, height } = image;

  const padding = 20;
  const x = padding;
  const y = padding;
  const contentWidth = newPage.getWidth() - 2 * padding;
  const contentHeight = newPage.getHeight() - 2 * padding;
  const scaleFactor = Math.min(contentWidth / width, contentHeight / height);
  const scaledWidth = width * scaleFactor;
  const scaledHeight = height * scaleFactor;
  const xOffset = (contentWidth - scaledWidth) / 2;
  const yOffset = (contentHeight - scaledHeight) / 2;

  const isPassed = step.status === 'Passed';
  const borderColor = isPassed ? rgb(0, 1, 0) : rgb(1, 0, 0);
  newPage.drawRectangle({
    x: x + xOffset,
    y: y + yOffset,
    width: scaledWidth,
    height: scaledHeight,
    borderColor: borderColor,
    borderWidth: 2,
  });

  newPage.drawImage(image, {
    x: x + xOffset,
    y: y + yOffset,
    width: scaledWidth,
    height: scaledHeight,
  });

  const description = step.name;
  const descriptionY = y + contentHeight - 40;
  newPage.drawText('Step '+(i+1)+' - '+description, {
    x: x,
    y: descriptionY,
    size: 15,
  });

  const statusY = y + contentHeight - 20;
  newPage.drawText(step.status, {
    x: x,
    y: statusY,
    size: 15,
  });

  if (i !== scriptSteps.length - 1) {
    newPage.moveDown(0.5);
  }
}

const fontSize = 20;
const margin = 20;
firstPage.drawText('Automation Test Execution Report', {
  x: margin,
  y: firstPage.getHeight() - margin - fontSize *1,
  size: 30,
});
firstPage.drawText('Test Case ID: '+testId, {
  x: margin,
  y: firstPage.getHeight() - margin - fontSize *4,
  size: fontSize,
});
firstPage.drawText('Description: '+description, {
  x: margin,
  y: firstPage.getHeight() - margin - fontSize * 6,
  size: fontSize,
});
firstPage.drawText('Total Test Steps (Action) Executed: ' + totalScriptLines , {
  x: margin,
  y: firstPage.getHeight() - margin - fontSize * 8,
  size: fontSize,
});
firstPage.drawText('Total Tests Passed: ' + totalPassed , {
  x: margin,
  y: firstPage.getHeight() - margin - fontSize * 10,
  size: fontSize,
});
firstPage.drawText('Total Tests Failed: ' + totalFailed, {
  x: margin,
  y: firstPage.getHeight() - margin - fontSize * 12,
  size: fontSize,
});

pdfBytes = await pdfDoc.save();

// Convert the PDF buffer to base64 data
const pdfData = Buffer.from(pdfBytes).toString('base64');

// Save the PDF to a file
filePath = './test_report1.pdf';

// Write the PDF buffer to a file
fs.writeFileSync(filePath, pdfBytes);

filePath = './test1_base64.txt';

fs.writeFileSync(filePath, pdfData);

console.log('PDF file written successfully:', filePath);

await driver.quit();

console.log('Selenium test executed successfully');

if (pdfData !== null) {
  pdfExist = true;
} else {
  pdfExist = false;
}

endTime = new Date().getTime()/1000;
return await Promise.resolve({pdfData, filePath, pdfExist, totalScriptLines, totalFailed, totalPassed, startTime, endTime});
} catch (error) {
console.error('An error occurred during test execution:', error);

if (pdfDoc) {
  const failurePage = pdfDoc.addPage();
  failurePage.drawText('Test Execution Failed', { x: 50, y: 700, size: 20 });
  failurePage.drawText(error.message, { x: 50, y: 680, size: 14 });

  pdfBytes = await pdfDoc.save();

  filePath = './test_report1.pdf';
  fs.writeFileSync(filePath, pdfBytes);
}
}
})();

`;





module.exports = {
  createTestRun,
  updateTestRun,
  getAllTestRuns,
  executeSeleniumTest
};