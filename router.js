import express from "express";
import moment from "moment";
const router = express.Router();

import { promises as fs, promises } from "fs";
const { readFile, writeFile } = fs;

//ITEM 1:
router.post("/", async (req, res) => {
    try {
        let grades = req.body;
        const grade = JSON.parse(await readFile("grades.json"));

        let gradeAluno = {
            id: grade.nextId,
            student: "Ramon Sales",
            subject: "01 - JavaScript",
            type: "Fórum",
            value: 15,
            timestamp: moment().format(),
        };
        grade.grades.push(gradeAluno);

        grade.nextId++;
        await writeFile("./grades.json", JSON.stringify(grade));
        res.send(gradeAluno);
        console.log(grade);

        res.end();
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

//ITEM 2:

router.put("/:id/:student/:subject/:type/:value", async (req, res) => {
    try {
        let item = [];
        let grades = JSON.parse(await readFile("./grades.json"));
        const { id, student, subject, type, value } = req.params;
        item = await grades.grades.find((grade) => {
            if (
                parseInt(id) === grade.id &&
                student === grade.student &&
                subject === grade.subject &&
                type === grade.type &&
                parseInt(value) === grade.value
            ) {
                return grade;
            }
        });
        if (item != null) {
            grades.grades[id - 1] = {
                id: item.id,
                student: item.student,
                subject: item.subject,
                type: item.type,
                value: 15,
                timestamp: moment().format(),
            };
        } else {
            console.log("Grade não encontrada!");
        }
        res.send(grades);

        res.end();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//ITEM 3:

router.delete("/:id", async (req, res) => {
    try {
        let grades = JSON.parse(await readFile("./grades.json"));
        grades = grades.grades.filter(
            (grade) => parseInt(req.params.id) !== grade.id
        );

        await writeFile("./grades", JSON.stringify(grades));
        res.send(grades);

        res.end();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//ITEM 4:

router.get("/:id", async (req, res) => {
    try {
        const grades = JSON.parse(await readFile("./grades.json"));
        delete grades.nextId;
        let filtro = grades.grades.find(
            (item) => parseInt(req.params.id) === item.id
        );
        res.send(filtro);

        res.end();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//ITEM 5:
router.patch("/:student/:subject", async (req, res) => {
    try {
        let grades = JSON.parse(await readFile("./grades.json"));
        const { student, subject } = req.params;
        const valores = [];
        await grades.grades.filter((grade) => {
            if (student === grade.student && subject === grade.subject) {
                valores.push(grade.value);
            }
        });
        const soma = await valores.reduce((ac, item) => (ac += item));

        res.send(
            "O valor total das notas do(a) aluno(a) " +
                student +
                " na disciplina " +
                subject +
                " é " +
                soma
        );
        res.end();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//ITEM 6:
router.get("/:subject/:type", async (req, res) => {
    try {
        let grades = JSON.parse(await readFile("./grades.json"));
        const { subject, type } = req.params;
        const valores = [];
        await grades.grades.filter((grade) => {
            if (subject === grade.subject && type === grade.type) {
                valores.push(grade.value);
            }
        });

        const soma = await valores.reduce((ac, item) => (ac += item));
        res.send(
            "A média da disciplina " +
                subject +
                " na atividade " +
                type +
                " é " +
                soma / valores.length
        );
        res.end();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//ITEM 7:
router.get("/grade/:type/:subject", async (req, res) => {
    try {
        let grades = JSON.parse(await readFile("./grades.json"));
        const { subject, type } = req.params;
        const valores = [];
        await grades.grades.filter((grade) => {
            if (subject === grade.subject && type === grade.type) {
                valores.push(grade);
            }
        });
        const arrayGrades = [];

        valores.forEach((item) => arrayGrades.push(item));
        res.send(arrayGrades.sort((a, b) => b.value - a.value).slice(0, 3));
        res.end();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;
