const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async( req, res = response ) => {

    const eventos = await Evento.find()
                                .populate('user','name'); //Llena documento con la referencia establecida

    res.json({
        ok: true,
        eventos
    });
}

const crearEvento = async( req, res = response ) => {

    const evento = new Evento( req.body );

    try {
        evento.user = req.uid;
        await evento.save();
        res.json({
            ok: true,
            evento: evento
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}   

const actualizarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById( eventoId );
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe'
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este elemento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        // El metodo findByIdAndUpdate retorna el evento antes de ser guardado sino tiene el tercer argumento
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            eventoActualizado
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const eliminarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById( eventoId );
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe'
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este elemento'
            });
        }

        // El metodo findByIdAndUpdate retorna el evento antes de ser guardado sino tiene el tercer argumento
        await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}