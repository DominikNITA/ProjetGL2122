//Ne pas modifier dans le client!!! juste dans le dossier shared
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
  Validated = "Validated",
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

export enum FraisType {
  Standard = 1,
  Kilometrique = 2,
}

export enum VehicleType {
  Car,
  Motorcycle,
  Scooter,
}
