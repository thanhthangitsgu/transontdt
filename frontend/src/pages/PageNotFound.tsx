import imagePage from '../assets/images/page-not-found.png'

export default function PageNotFound() {
    return (
        <section id='page-not-found'>
            <div className='main'>
                <img src={imagePage} alt="page-not-found" />
            </div>
        </section>
    )
}