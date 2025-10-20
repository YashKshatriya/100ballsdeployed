// Script to create a test tournament and verify the system
const createTestTournament = async () => {
  console.log("=== Creating Test Tournament ===");
  
  const testTournament = {
    title: "Test Cricket Tournament 2024",
    description: "A test tournament to verify the system is working correctly",
    startDate: "2024-12-01T00:00:00.000Z",
    endDate: "2024-12-15T00:00:00.000Z",
    venue: "Test Cricket Stadium",
    maxTeams: 8,
    registrationFee: 1000,
    prizePool: 50000,
    registrationDeadline: "2024-11-25T00:00:00.000Z",
    status: "upcoming",
    tournamentType: "league",
    format: "t20",
    registeredTeams: 0
  };
  
  try {
    // Try to create tournament on admin backend (port 8001)
    console.log("🔄 Creating tournament on admin backend (port 8001)...");
    const response = await fetch('http://localhost:8001/api/tournaments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTournament),
    });
    
    if (response.ok) {
      const createdTournament = await response.json();
      console.log("✅ Tournament created successfully!");
      console.log("📋 Tournament details:", createdTournament);
      console.log(`🎯 Tournament ID: ${createdTournament._id}`);
      
      // Now test fetching all tournaments
      console.log("\n🔄 Fetching all tournaments...");
      const fetchResponse = await fetch('http://localhost:8001/api/tournaments');
      const allTournaments = await fetchResponse.json();
      console.log(`📊 Found ${allTournaments.length} total tournaments`);
      
      return createdTournament;
    } else {
      const error = await response.json();
      console.log("❌ Failed to create tournament:", error);
      return null;
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
    console.log("💡 Make sure the backend server is running on port 8000");
    return null;
  }
};

// Run the test
createTestTournament().then(tournament => {
  if (tournament) {
    console.log("\n🎉 Test completed successfully!");
    console.log("📝 Next steps:");
    console.log("   1. Check the landing page - the tournament should appear there");
    console.log("   2. Use the admin panel to edit/delete the tournament");
    console.log("   3. Verify changes reflect in the landing page");
  }
}).catch(console.error);
