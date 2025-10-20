// Test script to verify tournament system is working
const testSystem = async () => {
  console.log("=== Tournament System Test ===");
  
  // Test 1: Check if API endpoints are accessible
  console.log("\n1. Testing API endpoints...");
  
  try {
    // Test main backend (port 8000)
    const mainResponse = await fetch('http://localhost:8000/api/tournaments');
    console.log("✅ Main backend (port 8000) is accessible");
    
    const mainTournaments = await mainResponse.json();
    console.log(`📊 Found ${mainTournaments.length} tournaments in main backend`);
    
  } catch (error) {
    console.log("❌ Main backend (port 8000) is not accessible:", error.message);
  }
  
  try {
    // Test admin backend (port 8001)
    const adminResponse = await fetch('http://localhost:8001/api/tournaments');
    console.log("✅ Admin backend (port 8001) is accessible");
    
    const adminTournaments = await adminResponse.json();
    console.log(`📊 Found ${adminTournaments.length} tournaments in admin backend`);
    
  } catch (error) {
    console.log("❌ Admin backend (port 8001) is not accessible:", error.message);
  }
  
  console.log("\n2. Instructions:");
  console.log("   - Start the backend server that should be used (port 8000 or 8001)");
  console.log("   - Create a tournament using the admin panel");
  console.log("   - Check if it appears in the landing page");
  console.log("   - Test deletion and make sure it disappears from landing page");
  
  console.log("\n3. Test tournament data:");
  console.log(JSON.stringify({
    title: "Test Tournament",
    description: "Test tournament for system verification",
    startDate: "2024-12-01T00:00:00.000Z",
    endDate: "2024-12-10T00:00:00.000Z",
    venue: "Test Ground",
    maxTeams: 8,
    registrationFee: 500,
    prizePool: 10000,
    registrationDeadline: "2024-11-25T00:00:00.000Z",
    status: "upcoming",
    tournamentType: "league",
    format: "t20",
    registeredTeams: 0
  }, null, 2));
};

// Run the test
testSystem().catch(console.error);
