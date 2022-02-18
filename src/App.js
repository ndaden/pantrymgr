import { useState, useEffect } from "react";
import { resizeMe } from "./utils";
import { STOCKS } from "./mocks";

function App() {
  const [img, setImg] = useState(null);
  const [imgCompressed, setImgCompressed] = useState(null);
  const [produits, setProduits] = useState(STOCKS);


  const [error] = useState("");

  const handleChange = e => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.addEventListener("load", () => {
      const uploaded_image = reader.result;
      setImg({ data: uploaded_image, size: e.target.files[0].size });
      setTimeout(() => {
        let image = new Image();
        image.src = uploaded_image;
        const compressed_image = resizeMe(image);
        setImgCompressed({ data: compressed_image, size: 0 });
      }, 3000);
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    let nvProduit = Object.fromEntries(data.entries());
    nvProduit.produit = nvProduit.produit.charAt(0).toUpperCase() + nvProduit.produit.slice(1);
    const existingProduct = produits.find(p => p.product === nvProduit.produit)
    if (existingProduct) {
      setProduits([...produits.filter(p => p.product !== nvProduit.produit), { product: nvProduit.produit, remainingQuantity: Number(existingProduct.remainingQuantity) + Number(nvProduit.quantite), unit: existingProduct.unit, comment: "", lastUpdateDate: new Date().toLocaleString("fr-FR") }]);
    } else {
      setProduits([...produits, { product: nvProduit.produit, remainingQuantity: nvProduit.quantite, unit: nvProduit.unite, comment: "", creationDate: new Date().toLocaleString("fr-FR") }]);
    }

    document.querySelector("input[name='produit']").value = "";
  }

  const handleDelete = (produit) => {
    setProduits(produits.filter(p => p.product !== produit));
  }

  const ajouter = (produit, quantite) => {
    setProduits(produits.map(p => {
      if (p.product === produit) {
        return { ...p, remainingQuantity: p.remainingQuantity + quantite, lastUpdateDate: new Date().toLocaleString("fr-FR") }
      } else {
        return p;
      }
    }
    ));
  }

  return (
    <div className="container">
      <h1>Pantry manager</h1>
      <form className="row row-cols-lg-auto g-3 align-items-center" onSubmit={handleSubmit}>
        <div className="col-12">
          <label className="visually-hidden" htmlFor="produit">Produit</label>
          <div className="input-group">
            <input name="produit" required className="form-control" list="listeProduits" id="exampleDataList" placeholder="Produit" autoComplete="off" />
            <datalist id="listeProduits">
              {produits.map(p =>
                <option key={p.product} value={p.product} />)}
            </datalist>


          </div>
        </div>
        <div className="col-12">
          <label className="visually-hidden" htmlFor="quantite">Quantité</label>
          <select name="quantite" className="form-select" id="quantite" defaultValue={1}>
            {[...Array(10).keys()].map(n => <option key={n + 1} value={n + 1}>{n + 1}</option>)}
          </select>
        </div>

        <div className="col-12">
          <label className="visually-hidden" htmlFor="unite">Unité</label>
          <select name="unite" className="form-select" id="unite" defaultValue={"boite"}>
            <option value="boite">Boîte</option>
            <option value="piece">Pièce</option>
            <option value="kg">Kg</option>
            <option value="litres">Litres</option>
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date ajout</th>
              <th scope="col">Date MàJ</th>
              <th scope="col">Produit</th>
              <th scope="col">Quantité</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((p, index) => (<tr key={p.product}>
              <th scope="row">{index}</th>
              <td>{p.creationDate}</td>
              <td>{p.lastUpdateDate}</td>
              <td>{p.product}</td>
              <td>
                <div className="input-group">
                  <div className="col-sm-3">
                    <input type="text" disabled className="form-control" value={`${p.remainingQuantity} ${p.unit}`} />
                  </div>
                  <button class="btn btn-outline-secondary" type="button" onClick={() => ajouter(p.product, 1)}>+</button>
                  {p.remainingQuantity > 1 && <button class="btn btn-outline-secondary" type="button" onClick={() => ajouter(p.product, -1)}>-</button>}
                </div>

              </td>
              <td><a href="#" onClick={() => handleDelete(p.product)}>Supprimer</a></td>
            </tr>))}
          </tbody>
          {produits.length === 0 && <p>Aucun produit dans la liste</p>}
        </table>
      </div>
    </div>
  );
}

export default App;
