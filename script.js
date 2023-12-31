const canvasEl = document.querySelector("canvas")
        const canvasCtx = canvasEl.getContext("2d")
        const gapX = 10

        const mouse = {x: 0 , y: 0}

        const jogo = {
            reincializar:function (){
                placar.jogador = 0
                placar.cpu = 0
                raqueteDireita.velocidade = 2
                bola.velocidade = 5
                bola.x = campo.w /2
                bola.y = campo.h /2

            }
        }

        const campo = {
            w: window.innerWidth,
            h: window.innerHeight,
            desenho:function(){
                canvasCtx.fillStyle = "#286047"
                canvasCtx.fillRect(0, 0, this.w, this.h )
            }

        }

        const linha = {
            w: 15,
            h: campo.h,
            desenho:function(){

                canvasCtx.fillStyle = "#ffffff"
                canvasCtx.fillRect(
                    campo.w /2 - this.w /2, 0, this.w, this.h
                )
            }
        }

        const raqueteEsquerda = {
            x: gapX,
            y: 0,
            w: linha.w,
            h: 200,

            _mover:function(){
                this.y = mouse.y - this.h / 2
            },
            desenho:function(){
                canvasCtx.fillStyle = "#ffffff"
                canvasCtx.fillRect(this.x, this.y, this.w, this.h)
                this._mover()
            }


        }

        const raqueteDireita = {
            x: campo.w - linha.w - gapX,
            y: 0,
            w: linha.w,
            h: 200,
            velocidade:2,
            _mover:function(){
                if(this.y + this.h /2 < bola.y + bola.r){
                    this.y += this.velocidade
                }else{
                    this.y -= this.velocidade
                }
            },
            aumentarVelocidade:function(){
                this.velocidade = this.velocidade + 1
            },
            desenho:function(){
                canvasCtx.fillStyle = "#ffffff"
                canvasCtx.fillRect(this.x, this.y, this.w, this.h)
                this._mover()
            }
        }

        const placar = {
            jogador: 0,
            cpu: 0,
            incrementaJogador:function(){
                this.jogador ++
                if(this.jogador == 10){
                    alert("Parabéns você venceu!!!")
                    jogo.reincializar()
                    
                }
            },
            incrementaCpu:function(){
                this.cpu ++
                if(this.cpu == 10){
                    alert("Você Perdeu!!!")
                    jogo.reincializar()
                }
            },
            desenho:function(){
                canvasCtx.font = "bold 72px Arial"
                canvasCtx.textAlign = "center"
                canvasCtx.textBaseline = "top"
                canvasCtx.fillStyle = "#01341D"
                canvasCtx.fillText(this.jogador , campo.w /4, 50)
                canvasCtx.fillText(this.cpu , campo.w /4 + campo.w /2 , 50)

            }

        }

        const bola = {
            x: 50,
            y: 0,
            r: 20,
            velocidade: 5,
            directionX: 1,
            directionY: 1,
            _calcPosition:function(){
                //verifica se o jogador fez o ponto(x > largura do campo)
                if(this.x > campo.w - this.r - gapX - raqueteDireita.w){
                    //verifica se a raquete direita está na posição y da bola
                    if(this.y + this.r > raqueteDireita.y && 
                    this.y - this.r < raqueteDireita.y + raqueteDireita.h){
                        //rebate a bola invertendo o sinal de x
                        this._reverseX()
                    }else{
                        //pontuar jogador
                        this._pontoFeito()
                        placar.incrementaJogador()

                    }
                }

                //verifica se o cpu fez o ponto(x<0)
                if(this.x < this.r + raqueteEsquerda.w + gapX) {
                    //verifica se a raquete esquerda está na posição y da bola
                    if(this.y + this.r > raqueteEsquerda.y && 
                    this.y - this.r < raqueteEsquerda.y + raqueteEsquerda.h){
                        //rebate a bola invertendo o sinal de x
                        this._reverseX()
                    }else{
                        //pontuar cpu
                        this._pontoFeito()
                        placar.incrementaCpu()

                    }
                }
                


                //verifica as laterais superior e inferior do campo
                if(
                    (this.y - this.r < 0 && this.directionY < 0) ||
                    (this.y > campo.h - this.r && this.directionY > 0)) {
                    this._reverseY()     

                }

            },
            _reverseX:function(){
                this.directionX = this.directionX * -1
            },
            _reverseY:function(){
                this.directionY = this.directionY * -1
            },
            _aumentarVelocidade:function(){
                this.velocidade = this.velocidade + 2
            },
            _pontoFeito:function(){
                this.x = campo.w /2
                this.y = campo.h /2
                this._aumentarVelocidade()
                raqueteDireita.aumentarVelocidade()
                
            },
            _mover:function(){
                this.x += this.directionX * this.velocidade
                this.y += this.directionY * this.velocidade

            },
            desenho:function(){
                canvasCtx.fillStyle = "#ffffff"
                canvasCtx.beginPath()
                canvasCtx.arc(this.x, this.y, this.r ,0 , 2*Math.PI,false)
                canvasCtx.fill()

                this._calcPosition()
                this._mover()
            }
        }

        function setup() {
            canvasEl.width = canvasCtx.width = campo.w
            canvasEl.height = canvasCtx.height = campo.h

        }

        function desenho() {
            campo.desenho()

            linha.desenho()

            raqueteEsquerda.desenho()
            raqueteDireita.desenho()

            placar.desenho()
            
            bola.desenho()
        
        }


        window.animateFrame = (function () {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (callback) {
            return window.setTimeout(callback, 1000 / 60)
          }
        )
      })()

        function main() {
            animateFrame(main)
            desenho()
        }

        setup()
        main()

        canvasEl.addEventListener('mousemove', function(e){
            mouse.x = e.pageX
            mouse.y = e.pageY
        })

        document.getElementById("botaoJogar").addEventListener("click",function(){
            document.querySelector(".welcome").style.display = "none";
            document.querySelector(".game-container").style.display = "block";
            main();
        })
