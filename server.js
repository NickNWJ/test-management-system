const autoIncrement = require('mongoose-auto-increment');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const cors = require('cors')
const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const { PDFDocument, rgb } = require('pdf-lib');
const assert = require('assert');
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const conn = require('./server/db/conn');
const fse = require('fs-extra');

app.use("/", express.static(path.join(__dirname, "public")));
app.use(conn);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const userRoutes = require('./server/routes/userRoutes');
const applicationRoutes = require('./server/routes/applicationRoutes');
const requirementRoutes = require('./server/routes/requirementRoutes');
const testPlanRoutes = require('./server/routes/testPlanRoutes');
const testCaseRoutes = require('./server/routes/testCaseRoutes');
const testRunRoutes = require('./server/routes/testRunRoutes');

app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/test-plans', testPlanRoutes);
app.use('/api/test-cases', testCaseRoutes);
app.use('/api/test-runs', testRunRoutes);


const { PORT = 8888 } = process.env;
app.listen(PORT, () => {
  console.log();
  console.log(`  App running in port ${PORT}`);
  console.log();
  console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
    // Call the function to execute the Selenium test
    // executeSeleniumTest();
});

const assetsRouter = require("./server/assets-router");
app.use("/src", assetsRouter);

const getTimestampString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}.${minute}.${second}`;
};



// async function executeSeleniumTest(TestCase) {
//   try {
//     // Create a new WebDriver instance (assuming Chrome browser)
//     const driver = await new Builder().forBrowser('chrome').build();

//     // Define the script steps
    // const scriptSteps = [
    //   {
    //     name: 'Accessing UTrust local home page',
    //     action: async () => {
    //       await driver.get('http://localhost:3000/');
    //       await captureScreenshot('UTrust Home Accessed', 'Passed');
    //       await new Promise(resolve => setTimeout(resolve, 2000));
    //     },
    //   },
    //   {
    //     name: 'Accessing UTrust Login Page',
    //     action: async () => {
    //       await driver.get('http://localhost:3000/login');
    //       await captureScreenshot('UTrust Login Accessed', 'Passed');
    //       await new Promise(resolve => setTimeout(resolve, 2000));
    //     },
    //   },
    //   {
    //     name: 'Entering email',
    //     action: async () => {
    //       const emailInput = await driver.findElement(By.css('input[placeholder="Enter your email"]'));
    //       await emailInput.sendKeys('uarehup@gmail.com');
    //       await captureScreenshot('Email entered', 'Passed');
    //     },
    //   },
    //   {
    //     name: 'Entering password',
    //     action: async () => {
    //       const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
    //       await passwordInput.sendKeys('123456');
    //       await captureScreenshot('Password entered', 'Passed');
    //     },
    //   },
    //   {
    //     name: 'Clicking login button',
    //     action: async () => {
    //       const loginButton = await driver.findElement(By.xpath('//button[text()="Log In"]'));
    //       await loginButton.click();
    //       await captureScreenshot('Login button clicked', 'Passed');
    //       await new Promise(resolve => setTimeout(resolve, 3000));
    //     },
    //   },
    //   {
    //     name: 'Checking current URL',
    //     action: async () => {
    //       const currentUrl = await driver.getCurrentUrl();
    //       assert.strictEqual(currentUrl, 'http://localhost:3000/');
    //       await captureScreenshot('Current URL checked', 'Passed');
    //       await new Promise(resolve => setTimeout(resolve, 5000));
    //     },
    //   },
      // {
      //   name: 'Clicking open menu button',
      //   action: async () => {
      //     const openMenuElement = await driver.findElement(By.xpath('//*[@id="root"]/div/nav/div[1]/button'));
      //     await openMenuElement.click();
      //     await captureScreenshot('Open menu button clicked', 'Passed');
      //     await new Promise(resolve => setTimeout(resolve, 5000));
      //   },
      // },
    //   {
    //     name: 'Clicking logout button',
    //     action: async () => {
    //       const logoutButton = await driver.findElement(By.xpath('//a[text()="Logout"]'));
    //       await logoutButton.click();
    //       await captureScreenshot('Logout button clicked', 'Passed');
    //     },
    //   },
    // ];

    // // Execute the script steps
    // for (const step of scriptSteps) {
    //   console.log(`[${getTimestampString()}] ${step.name}`);
    //   await step.action();
    // }

    // console.log('Test passed successfully');

    // // Create a new PDF document
    // const pdfDoc = await PDFDocument.create();

    // // Add the first page to the document
    // const firstPage = pdfDoc.addPage();

    // // Add the test case ID and description at the top of the first page
    // const testId = 'Test Case ID: T-001';
    // const description = 'Description: This is a sample test case.';
    // const totalScriptLines = scriptSteps.length;
    // const totalPassed = 10; // Replace with the actual count of tests passed
    // const totalFailed = 2; // Replace with the actual count of tests failed

    // const fontSize = 14;
    // const margin = 20;
    // firstPage.drawText(testId, {
    //   x: margin,
    //   y: firstPage.getHeight() - margin - fontSize,
    //   size: fontSize,
    // });
    // firstPage.drawText(description, {
    //   x: margin,
    //   y: firstPage.getHeight() - margin - fontSize * 2,
    //   size: fontSize,
    // });
    // firstPage.drawText(`Total Test Script Lines Executed: ${totalScriptLines}`, {
    //   x: margin,
    //   y: firstPage.getHeight() - margin - fontSize * 3,
    //   size: fontSize,
    // });
    // firstPage.drawText(`Total Tests Passed: ${totalPassed}`, {
    //   x: margin,
    //   y: firstPage.getHeight() - margin - fontSize * 4,
    //   size: fontSize,
    // });
    // firstPage.drawText(`Total Tests Failed: ${totalFailed}`, {
    //   x: margin,
    //   y: firstPage.getHeight() - margin - fontSize * 5,
    //   size: fontSize,
    // });

    // // Execute the script steps and add screenshots to the PDF
    // for (let i = 0; i < scriptSteps.length; i++) {
    //   const step = scriptSteps[i];

    //   // Perform the action for the step
    //   await step.action();

    //   // Capture a screenshot
    //   const screenshot = await driver.takeScreenshot();

    //   // Create a new page for each image and its steps
    //   const newPage = pdfDoc.addPage();

    //   // Set the page size based on the image dimensions
    //   const image = await pdfDoc.embedPng(Buffer.from(screenshot, 'base64'));
    //   const { width, height } = image;
    //   const padding = 20;
    //   const x = padding;
    //   const y = padding;
    //   const contentWidth = newPage.getWidth() - 2 * padding;
    //   const contentHeight = newPage.getHeight() - 2 * padding;

    //   // Calculate the scaled dimensions while maintaining the aspect ratio
    //   const scaleFactor = Math.min(contentWidth / width, contentHeight / height);
    //   const scaledWidth = width * scaleFactor;
    //   const scaledHeight = height * scaleFactor;

    //   // Calculate the position to center the image
    //   const xOffset = (contentWidth - scaledWidth) / 2;
    //   const yOffset = (contentHeight - scaledHeight) / 2;

    //   // Draw a border around the image based on the step result
    //   const isPassed = true; // Set to true or false based on the assertion result
    //   const borderColor = isPassed ? rgb(0, 1, 0) : rgb(1, 0, 0); // Green or red color
    //   newPage.drawRectangle({
    //     x: x + xOffset,
    //     y: y + yOffset,
    //     width: scaledWidth,
    //     height: scaledHeight,
    //     borderColor: borderColor,
    //     borderWidth: 2,
    //   });

    //   // Draw the image on the page with padding and centered
    //   newPage.drawImage(image, {
    //     x: x + xOffset,
    //     y: y + yOffset,
    //     width: scaledWidth,
    //     height: scaledHeight,
    //   });

    //   // Add the step description as an annotation on the page
    //   const description = `Step ${i + 1}) ${step.name}`;
    //   const descriptionY = y + contentHeight + 10;
    //   newPage.drawText(description, {
    //     x: x,
    //     y: descriptionY,
    //     size: 12,
    //   });

    //   // Add spacing between steps
    //   if (i !== scriptSteps.length - 1) {
    //     newPage.moveDown(0.5);
    //   }
    // }

    //     // Save the PDF to a buffer
    //     const pdfBytes = await pdfDoc.save();

    //     // Convert the PDF buffer to base64 data
    //     // const pdfData = pdfBytes.toString('base64');

    //     // Save the PDF to a file
    //     const filePath = './test_report.pdf';

    //     // Write the PDF buffer to a file
    //     fs.writeFileSync(filePath, pdfBytes);

    //     console.log('PDF file written successfully:', filePath);

    //     // Log the base64 data to the console
    //     // console.log('Base64 data:', pdfData);

    //     // Close the browser
    //     await driver.quit();
    //     console.log('Selenium test executed successfully');
    //   } catch (error) {
    //     console.error('An error occurred during test execution:', error);
    //   }
    // }



async function executeSeleniumTest(script) {
  let first = `(async function example() {
    let pdfDoc, filePath, pdfBytes, testId, totalScriptLines, totalPassed, totalFailed, startTime, endTime;
    try {\nstartTime = new Date().getTime()/1000`;


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

const yes = first.concat('\n',script).concat('\n',last);

  

let testRunRes;
  try {
      // Start message
      console.log(`Starting and waiting for script to complete...`);

      // Run and waiting for test scriptto be executed
      testRunRes = await eval(script);

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
    timeout: 6000,
  },
  {
    name: 'Accessing UTrust Login Page',
    action: async () => {
      await driver.get('http://localhost:3000/login');
    },
    message: 'UTrust Login Accessed',
    status: 'Passed',
    timeout: 6000,
  },
  {
    name: 'Entering email',
    action: async () => {
      const emailInput = await driver.findElement(By.css('input[placeholder="Enter your email"]'));
      await emailInput.sendKeys('uarehup@gmail.com');
    },
    message: 'Email entered',
    status: 'Passed',
    timeout: 6000,
  },
  {
    name: 'Entering password',
    action: async () => {
      const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
      await passwordInput.sendKeys('123456');
    },
    message: 'Password entered',
    status: 'Passed',
    timeout: 6000,
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

// const yes = first.concat('\n',script).concat('\n',last);
// executeSeleniumTest(yes);

// Execute the Selenium test and handle the result
// executeSeleniumTest(userInput);
