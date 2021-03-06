import serviceService from './serviceService';
import mongoose from 'mongoose';
import AuthService from './authService';
import userService from './userService';
import noteService from './noteService';
import noteLineService from './noteLineService';
import {
    AvanceState,
    ExpenseType,
    Month,
    NoteState,
    UserRole,
    VehicleType,
} from '../../../shared/enums';
import missionService from './missionService';
import avanceService from './avanceService';
import vehicleService from './vehicleService';
import fs from 'fs';
import path from 'path';
import { addDays } from '../utility/other';
import { VehicleMatrixModel } from '../models/vehicleMatrix';
import expenseCategoryService from './expenseCategoryService';

async function clearUploadFolder() {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    fs.readdir(uploadDir, (err, files) => {
        if (err) throw err;
        const doLog = process.env.NODE_ENV !== 'test';
        doLog &&
            console.log(
                `-  Clearing justificatifs (total count ${files.length}) started`
            );
        for (const file of files) {
            fs.unlink(path.join(uploadDir, file), (err) => {
                if (err) throw err;
            });
        }
        doLog && console.log('-  Clearing finished');
    });
}

function copyFromExampleDataToUploadFolder() {
    const examplesDir = 'tests/exampleData/justificatifs';
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    fs.readdir(examplesDir, (err, files) => {
        if (err) throw err;
        const doLog = process.env.NODE_ENV !== 'test';
        doLog &&
            console.log(
                `-  Moving justificatifs (total count ${files.length}) to uploads folder started`
            );
        for (const file of files) {
            fs.copyFile(
                path.join(examplesDir, file),
                path.join(uploadDir, file),
                fs.constants.COPYFILE_EXCL,
                (err) => {
                    if (err) throw err;
                }
            );
        }
        doLog && console.log('-  Moving finished');
    });
}

async function clearDB() {
    const collections = await mongoose.connection.db.collections();
    const doLog = process.env.NODE_ENV !== 'test';
    doLog && console.log('-  Clearing started');
    for (const collection of collections) {
        doLog &&
            console.log(`Clearing collection: ${collection.collectionName}`);
        await collection.deleteMany({});
    }
    doLog && console.log('-  Clearing finished');
}

async function initializeDB() {
    const doLog = process.env.NODE_ENV !== 'test';
    doLog && console.log('Initialization started');
    clearUploadFolder();
    copyFromExampleDataToUploadFolder();
    await clearDB();

    const service1 = await serviceService.createService({ name: 'R&D' });
    const service2 = await serviceService.createService({ name: 'RH' });
    await serviceService.createService({ name: 'Informatique' });
    const serviceComptabilite = await serviceService.createService({
        name: 'Comptabilite',
    });
    const serviceDirection = await serviceService.createService({
        name: 'Direction',
    });

    const mission1 = await missionService.createMission({
        name: 'Expo 2020',
        description: 'Stand sur Expo 2020 en Dubai',
        service: service1?._id,
        startDate: new Date(2022, 0, 15),
        endDate: new Date(2022, 0, 20),
    });

    const mission2 = await missionService.createMission({
        name: 'Vente client - Latorex',
        description: 'Delegation en Barcelone',
        service: service1?._id,
        startDate: new Date(2022, 1, 7),
        endDate: new Date(2022, 1, 11),
    });

    await missionService.createMission({
        name: 'Vente client - Mrith',
        description: 'Delegation en Ukraine',
        service: service1?._id,
        startDate: new Date(2022, 1, 10),
        endDate: new Date(2022, 1, 25),
    });

    await missionService.createMission({
        name: 'Vente client - Uberex',
        description: 'Client Uberex',
        service: service1?._id,
        startDate: new Date(2022, 2, 10),
        endDate: new Date(2022, 2, 15),
    });

    await missionService.createMission({
        name: 'Formation RH - Versailles',
        description: '2 jours de cours sur le teambuilding',
        service: service2?._id,
        startDate: new Date(2022, 2, 10),
        endDate: new Date(2022, 2, 11),
    });

    const user1 = await AuthService.registerUser(
        {
            email: 'GermainLemelin@rhyta.com',
            firstName: 'Germain',
            lastName: 'Lemelin',
            service: service1?.id,
        },
        'ziama1Ahfae'
    );
    const user2 = await AuthService.registerUser(
        {
            email: 'YolandeBisson@dayrep.com',
            firstName: 'Yolande',
            lastName: 'Bisson',
            service: service1?.id,
        },
        'IeCoo1Ee'
    );
    const user3 = await AuthService.registerUser(
        {
            email: 'FrancisAsselin@jourrapide.com',
            firstName: 'Francis',
            lastName: 'Asselin',
            service: service2?.id,
        },
        'Eec7ookee'
    );

    const user4 = await AuthService.registerUser(
        {
            email: 'DavetAvare@teleworm.us',
            firstName: 'Davet',
            lastName: 'Avare',
            service: service1?.id,
        },
        'aeZ2Kah1Ah'
    );

    const user5 = await AuthService.registerUser(
        {
            email: 'RouxLeblanc@rhyta.com',
            firstName: 'Roux',
            lastName: 'Leblanc',
            service: service1?.id,
        },
        'ohY7diekei'
    );

    const user6 = await AuthService.registerUser(
        {
            email: 'ArberMeunier@teleworm.us',
            firstName: 'Arber',
            lastName: 'Meunier',
            service: service2?.id,
        },
        'quu4baaLae'
    );

    const user7 = await AuthService.registerUser(
        {
            email: 'MarshallGuibord@armyspy.com',
            firstName: 'Marshall',
            lastName: 'Guibord',
            service: serviceComptabilite?.id,
        },
        'ith2Xae0h'
    );

    const userCompta = await AuthService.registerUser(
        {
            email: 'pierre.migene@abc.com',
            firstName: 'Pierre',
            lastName: 'Migene',
            service: serviceComptabilite?.id,
        },
        '123456'
    );

    const userBoss = await AuthService.registerUser(
        {
            email: 'pierre.vileneuve@abc.com',
            firstName: 'Pierre',
            lastName: 'Vileneuve',
            service: serviceDirection?.id,
        },
        '123456'
    );

    await serviceService.setLeader(service1?.id, user1?.id);
    await serviceService.setLeader(service2?.id, user3?.id);
    await serviceService.setLeader(serviceComptabilite?.id, userCompta?.id);
    await serviceService.setLeader(serviceDirection?.id, userBoss?.id);

    const vehicle1 = await vehicleService.createVehicle({
        vehicle: {
            description: 'Tesla Model3',
            horsePower: 3,
            owner: user2?._id,
            type: VehicleType.Car,
            isElectric: true,
        },
    });

    const vehicle2 = await vehicleService.createVehicle({
        vehicle: {
            description: 'BMW e60',
            horsePower: 5,
            owner: user1?._id,
            type: VehicleType.Car,
            isElectric: false,
        },
    });

    await vehicleService.createVehicle({
        vehicle: {
            description: 'Aventador',
            horsePower: 8,
            owner: userBoss?._id,
            type: VehicleType.Car,
            isElectric: false,
        },
    });

    const note1 = await noteService.createNote({
        owner: user1?._id,
        year: 2022,
        month: Month.January,
    });
    await noteService.createNote({
        owner: user1?._id,
        year: 2022,
        month: Month.February,
    });
    await noteService.createNote({
        owner: user1?._id,
        year: 2021,
        month: Month.December,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user1?._id,
        year: 2021,
        month: Month.November,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user1?._id,
        year: 2021,
        month: Month.October,
        state: NoteState.Validated,
    });
    const toValidateNote = await noteService.createNote({
        owner: user2?._id,
        year: 2022,
        month: Month.January,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2021,
        month: Month.December,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2021,
        month: Month.March,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2021,
        month: Month.April,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2021,
        month: Month.May,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2021,
        month: Month.June,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2021,
        month: Month.July,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2021,
        month: Month.August,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2021,
        month: Month.September,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2021,
        month: Month.October,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user2?._id,
        year: 2021,
        month: Month.November,
        state: NoteState.Validated,
    });
    await noteService.createNote({
        owner: user3?._id,
        year: 2022,
        month: Month.January,
    });

    const kilometriqueExpense =
        await expenseCategoryService.createExpenseCategory({
            name: 'Kilometrique',
            expenseType: ExpenseType.Kilometrique,
        });

    const logementExpense = await expenseCategoryService.createExpenseCategory({
        name: 'Logement',
        expenseType: ExpenseType.Standard,
    });

    const alimentationExpense =
        await expenseCategoryService.createExpenseCategory({
            name: 'Alimentation',
            expenseType: ExpenseType.Standard,
        });

    const transportExpense = await expenseCategoryService.createExpenseCategory(
        {
            name: 'Transport',
            expenseType: ExpenseType.Standard,
        }
    );

    await noteLineService.createNoteLine({
        expenseCategory: alimentationExpense,
        mission: mission1!._id,
        description: 'Restaurant',
        ttc: 12.99,
        ht: 10,
        note: note1?.id,
        date: mission1!.startDate,
        justificatif: 'example1.png',
    });

    await noteLineService.createNoteLine({
        expenseCategory: logementExpense,
        mission: mission1!._id,
        description: 'Hotel Alastar pour 3 nuits',
        ttc: 250.45,
        tva: 100.25,
        note: note1?.id,
        date: mission1!.startDate,
        justificatif: 'example2.png',
    });

    await noteLineService.createNoteLine({
        expenseCategory: logementExpense,
        mission: mission1!._id,
        description: 'Hotel en dubai',
        ttc: 450.99,
        tva: 80.25,
        note: toValidateNote?.id,
        date: mission1!.startDate,
        justificatif: 'example2.png',
    });

    await noteLineService.createNoteLine({
        expenseCategory: alimentationExpense,
        mission: mission1!._id,
        description: 'Restaurant durant la premiere journee',
        ttc: 25.99,
        tva: 6.25,
        note: toValidateNote?.id,
        date: addDays(mission1!.startDate, 1),
        justificatif: 'example1.png',
    });

    await noteLineService.createNoteLine({
        expenseCategory: transportExpense,
        mission: mission1!._id,
        description: "Bilet d'avion aller-retour Paris-Dubai",
        ttc: 400,
        note: toValidateNote?.id,
        date: mission1!.startDate,
        justificatif: 'example1.png',
    });

    await noteLineService.createNoteLine({
        expenseCategory: alimentationExpense,
        mission: mission1!._id,
        description: 'McDo deuxieme journee',
        ttc: 15.56,
        tva: 3.33,
        note: toValidateNote?.id,
        date: addDays(mission1!.startDate, 2),
        justificatif: 'example1.png',
    });

    await noteLineService.createNoteLine({
        expenseCategory: logementExpense,
        mission: mission2!._id,
        description: 'Hotel dans le banlieu de Barcelone - 2 nuits',
        ht: 80.25,
        ttc: 100.33,
        note: toValidateNote?.id,
        date: addDays(mission2!.startDate, 1),
    });

    await noteLineService.createNoteLine({
        expenseCategory: kilometriqueExpense,
        vehicle: vehicle1!._id.toString(),
        kilometerCount: 1050,
        mission: mission2!._id,
        description: 'Trajet de Paris vers Barcelone',
        note: toValidateNote?.id,
        date: addDays(mission2!.startDate, 1),
    });

    await noteLineService.createNoteLine({
        expenseCategory: kilometriqueExpense,
        vehicle: vehicle1!._id.toString(),
        kilometerCount: 1050,
        mission: mission2!._id,
        description: 'Trajet de Barcelone vers Paris',
        note: toValidateNote?.id,
        date: addDays(mission2!.endDate, -1),
    });

    const avance1 = await avanceService.createAvance({
        owner: user1?._id,
        description: 'Avion et Hotel',
        mission: mission1?._id,
        amount: 150,
    });

    const avance2 = await avanceService.createAvance({
        owner: user1?._id,
        description: 'Avion et restaurants',
        mission: mission2?._id,
        amount: 150,
    });

    await avanceService.setAvanceState(avance1?.id, AvanceState.Validated);
    await avanceService.setAvanceState(avance2?.id, AvanceState.Refused);

    //await noteService.changeState(toValidateNote?._id, NoteState.InValidation);

    // Baremes pour l'annee 2021
    await new VehicleMatrixModel({
        year: 2021,
        vehicleType: VehicleType.Car,
        kilometerMilestones: [5000, 20000],
        horsePowerMilestones: [3, 4, 5, 6, 7],
        data: [
            [0.456, 0.273, 0.318],
            [0.523, 0.294, 0.352],
            [0.548, 0.308, 0.368],
            [0.574, 0.323, 0.386],
            [0.601, 0.34, 0.405],
        ],
    }).save();

    await new VehicleMatrixModel({
        year: 2021,
        vehicleType: VehicleType.Motorcycle,
        kilometerMilestones: [3000, 6000],
        horsePowerMilestones: [2, 5, 6],
        data: [
            [0.341, 0.085, 0.213],
            [0.404, 0.071, 0.237],
            [0.523, 0.068, 0.295],
        ],
    }).save();

    await new VehicleMatrixModel({
        year: 2021,
        vehicleType: VehicleType.Scooter,
        kilometerMilestones: [2000, 5000],
        horsePowerMilestones: [0],
        data: [[0.272, 0.064, 0.147]],
    }).save();

    // Baremes pour l'annee 2022
    await new VehicleMatrixModel({
        year: 2022,
        vehicleType: VehicleType.Car,
        kilometerMilestones: [5000, 20000],
        horsePowerMilestones: [3, 4, 5, 6, 7],
        data: [
            [0.502, 0.3, 0.35],
            [0.575, 0.323, 0.387],
            [0.603, 0.339, 0.405],
            [0.631, 0.355, 0.425],
            [0.661, 0.374, 0.446],
        ],
    }).save();

    await new VehicleMatrixModel({
        year: 2022,
        vehicleType: VehicleType.Motorcycle,
        kilometerMilestones: [3000, 6000],
        horsePowerMilestones: [2, 5, 6],
        data: [
            [0.375, 0.094, 0.234],
            [0.444, 0.078, 0.261],
            [0.575, 0.075, 0.325],
        ],
    }).save();

    await new VehicleMatrixModel({
        year: 2022,
        vehicleType: VehicleType.Scooter,
        kilometerMilestones: [2000, 5000],
        horsePowerMilestones: [0],
        data: [[0.299, 0.07, 0.162]],
    }).save();

    doLog && console.log('Initialization finished without errors');
}

export default { clearDB, initializeDB, clearUploadFolder };
