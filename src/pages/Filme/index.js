import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import './style.css';
import api from '../../services/api'

function Filme() {
    const{ id } = useParams();
    const navigation = useNavigate();
    const [filme, setFilme] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        async function loadFilme(){
            await api.get(`/movie/${id}`, {
                params:{
                    api_key: "28fc232cc001c31e8a031f419d0a14ca",
                    language: "pt-BR",
                }
            })
            .then((response) =>{
                setFilme(response.data);
                setLoading(false);
            })
            .catch(() => {
                console.log("FILME NAO ENCONTRADO");
                navigation("/", { replace: true});
                return;
            })

        }

        loadFilme();


        return () => {

        }

    }, [navigation, id])

    function salvarFilme(){
        const minhaLista = localStorage.getItem("@primeFlix");

        let filmesSalvos = JSON.parse(minhaLista) || [];
        const hasFilme = filmesSalvos.some( (filmesSalvos) => filmesSalvos.id === filme.id);

        if(hasFilme){
            toast.warn("Esse filme já esta na lista");
            return;
        }

        filmesSalvos.push(filme);
        localStorage.setItem("@primeFlix", JSON.stringify(filmesSalvos));
        toast.success("Filme salvo com sucesso!")
    }

    if(loading){
        return(
            <div className="filme-info">
                <h1>Carregando detalhes...</h1>
            </div>
        );
    }

    return(
        <div className="filme-info">
            <h1>{filme.title}</h1>
            <img className="img" src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`} alt={filme.title}/>
            <h3>Sinopse</h3>
            <span>{filme.overview}</span>

            <div className="area-buttons">
                <button onClick={salvarFilme}>Salvar</button>
                <button>
                    <a  target="blank" rel="external" href={`http://youtube.com/results?search_query=${filme.title} Trailer`}>
                        Trailer
                    </a>
                    
                </button>

            </div>

            <strong>Avaliação: {filme.vote_average} / 10 </strong>
        </div>
    );
}

export default Filme;