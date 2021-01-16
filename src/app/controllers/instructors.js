const instructor = require('../models/instructors')
const { age, date } = require('../../lib/utilitarios')
const instructors = require('../models/instructors')

module.exports = {
    list(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            limit,
            offset,
            callback(foundInstructor) {
                foundInstructor.forEach( instructor => {
                    instructor.services = instructor.services.split(',')
                })

                // console.log(foundInstructor)

                res.render('instructors/index', { instructors: foundInstructor, filter })
            }
        }

        instructors.paginate(params)

        // if (filter) {
        //     instructors.findBy(filter, instructors => {

        //         instructors.forEach( instructor => {
        //             instructor.services = instructor.services.split(',')
        //         })

        //         res.render('instructors/index', { instructors, filter })
        //     })
        // } else {
        //    instructor.all( instructors => {
        //         for (instructor_item of instructors) {
        //             instructor_item.services = instructor_item.services.split(',')
        //         }
    
        //         return res.render(`instructors/index`, { instructors })
        //     })  
        // }

    },
    create(req, res) {
        const instructor = { gender: 'F'}
        return res.render('instructors/create', { instructor })
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "") return res.send(`O campo "${key}" está vazio. Por favor, preencha todos os campos.`)
        }

        instructor.create(req.body, instructor => {
            return res.redirect(`/instructors/${ instructor.id }`)
        })
    },
    show(req, res) {
        instructor.find(req.params.id, instructor => {
            if (!instructor) return res.send("Instrutor não encontrado!")

            instructor.age = age(instructor.birth)
            instructor.services = instructor.services.split(',')
            instructor.created_at = date(instructor.created_at).format

            return res.render('instructors/show', { instructor })
        })
    },
    edit(req, res) {
        instructor.find(req.params.id, instructor => {
            if (!instructor) return res.send("Instrutor não encontrado!")

            instructor.birth = date(instructor.birth).ISO

            return res.render('instructors/edit', { instructor })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "") return res.send(`O campo "${key}" está vazio. Por favor, preencha todos os campos.`)
        }

        instructor.update(req.body, () => res.redirect(`/instructors/${ req.body.id }`))
    },
    delete(req, res) {
        instructor.delete(req.body.id, () => {
            res.redirect('/instructors')
        })
    }
}