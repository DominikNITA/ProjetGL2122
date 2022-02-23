//Ne pas modifier dans le client!!! juste dans le dossier shared
// Puis copier vers le client avec le script copyEnums

export enum NoteViewMode {
  InitialCreation = 1,
  View = 2,
  Fix = 3,
  Validate = 4,
  Unknown = 100,
}

export enum NoteState {
  Created = "Created",
  InValidation = "InValidation",
  Fixing = "Fixing",
  Validated = "Validated",
  Completed = "Completed",
}

export enum UserRole {
  Collaborator = "Collaborator",
  Leader = "Leader",
  FinanceLeader = "FinanceLeader",
  Director = "Director",
}

export enum NoteLineState {
  Created = "Created",
  Fixing = "Fixing",
  Fixed = "Fixed",
  Validated = "Validated",
}

export enum MissionState {
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Finished = "Finished",
  Cancelled = "Cancelled",
}

export enum AvanceState {
  Created = "Created",
  Validated = "Validated",
  Refused = "Refused",
}

export enum Month {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

export enum ExpenseType {
  Standard = 1,
  Kilometrique = 2,
}

export enum VehicleType {
  Car,
  Motorcycle,
  Scooter,
}
