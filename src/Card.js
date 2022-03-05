import * as IconGi from 'react-icons/gi';
import * as IconFa from 'react-icons/fa';

function Card({ productName, quantity, addOne, removeOne, deleteProduct }) {
    const getFontSize = (length) => {
        if (length >= 24) {
            return "11px";
        }
        if (length > 10 && length < 24) {
            return "14px";
        }
        return "";
    }

    const getIcon = (product) => {
        if (product.toLowerCase().includes("tomate")) {
            return <IconGi.GiTomato style={{ fontSize: "4rem" }} />
        }
        if (product.toLowerCase().includes("lait")) {
            return <IconGi.GiMilkCarton style={{ fontSize: "4rem" }} />
        }
        if (product.toLowerCase().includes("toilette")) {
            return <IconFa.FaToiletPaper style={{ fontSize: "4rem" }} />
        }
        if (product.toLowerCase().includes("bière")) {
            return <IconFa.FaBeer style={{ fontSize: "4rem" }} />
        }

        return <IconGi.GiCardboardBox style={{ fontSize: "4rem" }} />;
    }

    return (<div className="card text-white bg-dark bg-gradient" style={{ width: "9rem", height: "9rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
        <div className="card-body text-center p-1">
            <div className='float-end text-warning' onClick={deleteProduct}><IconFa.FaTrashAlt /></div>
            {getIcon(productName)}
            <h5 className="card-title" style={{ fontSize: getFontSize(productName.length) }}>{productName}</h5>
            <p className="card-text">
                <button type="button" className="btn btn-secondary btn-sm mx-1" onClick={removeOne}>-</button>
                <span style={{ fontSize: '12px' }}>{quantity}</span>
                <button type="button" className="btn btn-secondary btn-sm mx-1" onClick={addOne}>+</button>
            </p>

        </div>
    </div>)
}

export default Card;