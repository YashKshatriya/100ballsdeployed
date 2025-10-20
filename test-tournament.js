const testTournament = {
  title: "Test Cricket Tournament",
  description: "A test tournament to verify the system is working",
  startDate: "2024-12-01T00:00:00.000Z",
  endDate: "2024-12-15T00:00:00.000Z",
  venue: "Test Stadium",
  maxTeams: 8,
  registrationFee: 1000,
  prizePool: 50000,
  registrationDeadline: "2024-11-25T00:00:00.000Z",
  status: "upcoming",
  tournamentType: "league",
  format: "t20",
  registeredTeams: 0
};

console.log("Test tournament data:", JSON.stringify(testTournament, null, 2));
console.log("You can use this data to create a test tournament via the admin panel or API");
