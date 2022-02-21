import serviceService from './serviceService';
import mongoose from 'mongoose';
import AuthService from './authService';
import userService from './userService';
import noteService from './noteService';
import noteLineService from './noteLineService';
import {
    FraisType,
    Month,
    NoteState,
    UserRole,
    VehicleType,
} from '../../../shared/enums';
import missionService from './missionService';
import vehicleService from './vehicleService';
import fs from 'fs';
import path from 'path';
import { addDays } from '../utility/other';

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
    console.log('Initialization started');
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
        name: 'Client - Latorex',
        description: 'Delegation en Barcelone',
        service: service1?._id,
        startDate: new Date(2022, 1, 7),
        endDate: new Date(2022, 1, 11),
    });

    const user1 = await AuthService.registerUser(
        {
            email: 'test1@abc.com',
            firstName: 'Mike',
            lastName: 'Garland',
            service: service1?.id,
        },
        '123456'
    );
    const user2 = await AuthService.registerUser(
        {
            email: 'test2@abc.com',
            firstName: 'Jacques',
            lastName: 'Coel',
            service: service1?.id,
        },
        '123456'
    );
    const user3 = await AuthService.registerUser(
        {
            email: 'test3@abc.com',
            firstName: 'Francesco',
            lastName: 'Maradona',
            service: service2?.id,
        },
        '123456'
    );

    const userCompta = await AuthService.registerUser(
        {
            email: 'test4@abc.com',
            firstName: 'Pierre',
            lastName: 'Migene',
            service: serviceComptabilite?.id,
        },
        '123456'
    );

    const userBoss = await AuthService.registerUser(
        {
            email: 'test100@abc.com',
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
            description: 'Renault Clio',
            horsePower: 2,
            owner: user2?._id,
            type: VehicleType.Car,
            isElectric: false,
        },
    });

    await vehicleService.createVehicle({
        vehicle: {
            description: 'BMW e60',
            horsePower: 5,
            owner: user1?._id,
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
        owner: user3?._id,
        year: 2022,
        month: Month.January,
    });

    await noteLineService.createNoteLine({
        fraisType: FraisType.Standard,
        mission: mission1!._id,
        description: 'Restaurant',
        ttc: 12.99,
        ht: 10,
        note: note1?.id,
        date: mission1!.startDate,
        justificatif: 'example1.png',
    });

    await noteLineService.createNoteLine({
        fraisType: FraisType.Standard,
        mission: mission1!._id,
        description: 'Hotel Alastar pour 3 nuits',
        ht: 250.45,
        tva: 100.25,
        note: note1?.id,
        date: mission1!.startDate,
        justificatif: 'example2.png',
    });

    await noteLineService.createNoteLine({
        fraisType: FraisType.Standard,
        mission: mission1!._id,
        description: 'Hotel en dubai',
        ht: 450.99,
        tva: 80.25,
        note: toValidateNote?.id,
        date: mission1!.startDate,
        justificatif: 'example2.png',
    });

    await noteLineService.createNoteLine({
        fraisType: FraisType.Standard,
        mission: mission1!._id,
        description: 'Restaurant durant la premiere journee',
        ht: 25.99,
        tva: 6.25,
        note: toValidateNote?.id,
        date: addDays(mission1!.startDate, 1),
        justificatif: 'example1.png',
    });

    await noteLineService.createNoteLine({
        fraisType: FraisType.Standard,
        mission: mission1!._id,
        description: "Bilet d'avion aller-retour Paris-Dubai",
        ht: 400,
        tva: 75,
        note: toValidateNote?.id,
        date: mission1!.startDate,
        justificatif: 'example1.png',
    });

    await noteLineService.createNoteLine({
        fraisType: FraisType.Standard,
        mission: mission1!._id,
        description: 'McDo deuxieme journee',
        ht: 15.56,
        tva: 3.33,
        note: toValidateNote?.id,
        date: addDays(mission1!.startDate, 2),
        justificatif: 'example1.png',
    });

    await noteLineService.createNoteLine({
        fraisType: FraisType.Standard,
        mission: mission2!._id,
        description: 'Hotel dans le banlieu de Barcelone - 2 nuits',
        ht: 99.25,
        tva: 10.33,
        note: toValidateNote?.id,
        date: addDays(mission2!.startDate, 1),
    });

    await noteLineService.createNoteLine({
        fraisType: FraisType.Kilometrique,
        vehicle: vehicle1!._id.toString(),
        kilometerCount: 1050,
        mission: mission2!._id,
        description: 'Trajet de Paris vers Barcelone',
        note: toValidateNote?.id,
        date: addDays(mission2!.startDate, 1),
    });

    await noteLineService.createNoteLine({
        fraisType: FraisType.Kilometrique,
        vehicle: vehicle1!._id.toString(),
        kilometerCount: 1050,
        mission: mission2!._id,
        description: 'Trajet de Barcelone vers Paris',
        note: toValidateNote?.id,
        date: addDays(mission2!.endDate, -1),
    });

    await noteService.changeState(toValidateNote?._id, NoteState.InValidation);

    console.log('Initialization finished without errors');
}

export default { clearDB, initializeDB, clearUploadFolder };
