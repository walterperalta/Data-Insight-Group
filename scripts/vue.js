let chamber = document.querySelector('#tabla-senate') ? 'senate' : 'house'
Vue.createApp({
    data() {
        return {
            URLAPI: `https://api.propublica.org/congress/v1/113/${chamber}/members.json`,
            init : {
                method: 'GET',
                headers: {
                    'X-API-Key': 'ctfnOz0K96RJjsi8xrHRvKyFYQPZfdnAZLZKwExb'
                }
            },
            camara: [],
            estadosSinRepetir: [],
            partidosSeleccionados: [],
            miembrosPorPartido: [],
            miembrosFiltrados: [],
            miembros_10: 0,
            selectValue: 'all',
            general : [
                {
                    'partido':'D',
                    'partido_l' : 'Democrats',
                    'cantidad' : 3,
                    'pct_voted' : 0
                },
                {
                    'partido':'R',
                    'partido_l' : 'Republicans',
                    'cantidad' : 2,
                    'pct_voted' : 0
                },
                {
                    'partido':'ID',
                    'partido_l' : 'Independents',
                    'cantidad' : 4,
                    'pct_voted' : 0
                }
            ],
            mas: [],
            menos: [],
            masLeales: [],
            menosLeales: [],
            readMore: false,
            nombreBuscador: "",
            camaraAuxiliar: []            
        }

    },
    created() {
        fetch(this.URLAPI,this.init)
            .then(response => response.json())
                .then(data => {
                    this.camara = data.results[0].members
                    this.miembros_10 = Math.round(this.camara.length * 0.1)
                    this.camaraAuxiliar = this.camara
                    console.log(this.camara)
                })
    },
    methods : {
        leerMas() {
            var moreText = document.getElementById("more");
            var btnText = document.getElementById("myBtn");
          
            if ( moreText.style.display === "none") {
              btnText.innerHTML = "Read less";
              moreText.style.display = "inline";
            } else {
              btnText.innerHTML = "Read More";
              moreText.style.display = "none";
            }
        }
    },
    computed : {
        cantidadPorPartido(){
            this.general.forEach(partido => {
                let cant = this.camara.filter(miembro => miembro.party === partido.partido)
                partido.cantidad = cant.length     
                let acum = 0
                let cont = 0
                this.camara.forEach(miembro => {
                    if(miembro.party === partido.partido){
                        acum += miembro.votes_with_party_pct
                        cont ++
                    }
                })  
                partido.pct_voted = Math.round(acum/cont)      
            })
        },
        listaEstados (){
            this.estadosSinRepetir = []
            this.camara.forEach(miembro => {
                if(!this.estadosSinRepetir.includes(miembro.state)){
                    this.estadosSinRepetir.push(miembro.state)
                }
            })
        },

        filtrarPorPartido (){
            this.miembrosFiltrados = []

            if (this.partidosSeleccionados.length == 0){
                this.miembrosFiltrados = this.camara
            } else {
                this.camara.forEach(miembro => {
                    this.partidosSeleccionados.forEach(check =>{
                        if (miembro.party === check){
                            this.miembrosFiltrados.push(miembro)
                        }
                    })
                })
            }
            if (this.selectValue != 'all'){
                let filtradosPorEstados = this.miembrosFiltrados.filter(miembro => miembro.state == this.selectValue)
                this.miembrosFiltrados = filtradosPorEstados
    
            }
        },

        poblarTablaAsistencia(){
            let auxiliar = this.camara
            auxiliar.sort(function (a, b) {
                if (a.missed_votes_pct > b.missed_votes_pct) {
                return 1;
                }
                if (a.missed_votes_pct < b.missed_votes_pct) {
                return -1;
                }
                return 0;
            })
            let masComprometidos = []
            for (let index = 0; index < this.miembros_10; index++) {
                masComprometidos.push(auxiliar[index])
            }
            auxiliar.sort(function (a, b) {
                if (a.missed_votes_pct < b.missed_votes_pct) {
                return 1;
                }
                if (a.missed_votes_pct > b.missed_votes_pct) {
                return -1;
                }
                return 0;
            })
            let menosComprometidos = []
            for (let index = 0; index < this.miembros_10; index++) {
                menosComprometidos.push(auxiliar[index])
            }

            this.mas = masComprometidos
            this.menos = menosComprometidos

        }, 
        poblarTablaLoyalty(){
            let auxiliar = this.camara
            auxiliar.sort(function (a, b) {
                if (a.votes_with_party_pct > b.votes_with_party_pct) {
                return 1;
                }
                if (a.votes_with_party_pct < b.votes_with_party_pct) {
                return -1;
                }
                return 0;
            })
            let masComprometidos = []
            for (let index = 0; index < this.miembros_10; index++) {
                masComprometidos.push(auxiliar[index])
            }
            auxiliar.sort(function (a, b) {
                if (a.votes_with_party_pct < b.votes_with_party_pct) {
                return 1;
                }
                if (a.votes_with_party_pct > b.votes_with_party_pct) {
                return -1;
                }
                return 0;
            })
            let menosComprometidos = []
            for (let index = 0; index < this.miembros_10; index++) {
                menosComprometidos.push(auxiliar[index])
            }

            this.menosLeales = menosComprometidos
            this.masLeales = masComprometidos

        },
        // buscador(){
        //     if(this.nombreBuscador != ""){
        //         this.camaraAuxiliar = this.camara.filter(miembro => miembro.last_name.includes(this.nombreBuscador) || miembro.first_name.includes(this.nombreBuscador))
        //     }else{
        //         this.camaraAuxiliar = this.miembrosFiltrados
        //     }
        // }
        

    }

}).mount('#app')