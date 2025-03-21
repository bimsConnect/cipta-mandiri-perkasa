export async function getVisitorAnalytics(period: "day" | "week" | "month" = "day", startDate?: Date, endDate?: Date) {
    // In a real application, you would fetch visitor analytics from a database
    // based on the specified period and date range.
    // For this example, we'll just return some dummy data.
  
    const dummyData = [
      { time: new Date(), count: 10 },
      { time: new Date(), count: 15 },
      { time: new Date(), count: 20 },
    ]
  
    return dummyData
  }
  
  export async function getAllVisitorData(startDate?: Date, endDate?: Date) {
    // In a real application, you would fetch all visitor data from a database
    // within the specified date range.
    // For this example, we'll just return some dummy data.
  
    const dummyData = [
      {
        id: 1,
        path: "/",
        browser: "Chrome",
        operatingSystem: "Windows",
        deviceType: "desktop",
        ipAddress: "127.0.0.1",
        country: "Indonesia",
        city: "Jakarta",
        referrer: "google.com",
        sessionId: "1234567890",
        createdAt: new Date(),
      },
      {
        id: 2,
        path: "/blog",
        browser: "Firefox",
        operatingSystem: "MacOS",
        deviceType: "desktop",
        ipAddress: "127.0.0.1",
        country: "Indonesia",
        city: "Bandung",
        referrer: "direct",
        sessionId: "0987654321",
        createdAt: new Date(),
      },
    ]
  
    return dummyData
  }
  
  