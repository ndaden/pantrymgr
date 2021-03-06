import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "./service/productService";
import { getReferentialValues } from "./service/referentialService";
import Card from "./Card";

function App() {
  const [produits, setProduits] = useState([]);
  const [units, setUnits] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [search, setSearch] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    let nvProduit = Object.fromEntries(data.entries());
    nvProduit.produit = nvProduit.produit.charAt(0).toUpperCase() + nvProduit.produit.slice(1);
    const existingProduct = produits.find(p => p.productName === nvProduit.produit)
    if (existingProduct) {
      updateProduit({ id: existingProduct.id, remainingQuantity: Number(existingProduct.remainingQuantity) + Number(nvProduit.quantite), lastUpdateDate: new Date().toISOString() })
      // setProduits([...produits.filter(p => p.productName !== nvProduit.produit), { productName: nvProduit.produit, remainingQuantity: Number(existingProduct.remainingQuantity) + Number(nvProduit.quantite), unit: existingProduct.unit, comment: "", lastUpdateDate: new Date().toLocaleString("fr-FR") }]);
    } else {
      createProduct({
        productName: nvProduit.produit,
        remainingQuantity: Number(nvProduit.quantite),
        unit: nvProduit.unite,
      }).then(() => {
        console.log("Product created successfully");
        setRefresh(refresh + 1);
      }).catch((err) => {
        console.log(err);
      })
      // setProduits([...produits, { productName: nvProduit.produit, remainingQuantity: nvProduit.quantite, unit: nvProduit.unite, comment: "", creationDate: new Date().toLocaleString("fr-FR") }]);
    }

    document.querySelector("input[name='produit']").value = "";
  }

  const handleDelete = (produit) => {
    deleteProduct(produit).then(() => {
      console.log("produit supprim?? avec succ??s");
      setRefresh(refresh + 1);
      alert(`${produit.productName} a ??t?? supprim??`)
    }).catch((error) => {
      console.log("une erreur s'est produite lors de la suppression");
    })
  }

  const ajouter = (produit, quantite) => {
    updateProduit({ id: produit.id, remainingQuantity: Number(produit.remainingQuantity) + Number(quantite), lastUpdateDate: new Date().toISOString() })
  }

  const updateProduit = (produit) => {
    updateProduct(produit)
      .then(() => {
        console.log('Product updated successfully');
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log('error occured while updating :', error)
      });
  }

  const searchProduct = (e) => {
    if (e.target.value.length >= 3) {
      setSearch(e.target.value);
    } else {
      setSearch("");
    }
  }

  useEffect(() => {
    getReferentialValues('QUANTITY_UNIT').then(async (result) => {
      setUnits(await result.json());
    }).catch((error) => {
      console.log('an error occured while fetching referential values');
    })
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts().then(async (res) => {
      const result = [...await res.json()];
      let filteredResult = result.filter(r => r.productName.toLowerCase().includes(search.toLowerCase()));
      setProduits([...filteredResult.filter(r => r.remainingQuantity === 0), ...filteredResult.filter(r => r.remainingQuantity !== 0)]);
      setLoading(false);
      window.scrollTo(0, 260);
    }).catch((err) => console.log(err));
  }, [refresh, search]);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">Pantry manager
        </a>
      </nav>
      <div className="container pt-3">
        <button className="btn btn-link" onClick={() => setShowTable(!showTable)}>Mode: tableau</button>
        <form className="row row-cols-lg-auto g-3 align-items-center" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="visually-hidden" htmlFor="produit">Produit</label>
            <div className="input-group">
              <input name="produit" required className="form-control" list="listeProduits" id="exampleDataList" placeholder="Produit" autoComplete="off" />
              <datalist id="listeProduits">
                {produits.map(p =>
                  <option key={p.productName} value={p.productName} />)}
              </datalist>
            </div>
          </div>
          <div className="col-12">
            <label className="visually-hidden" htmlFor="quantite">Quantit??</label>
            <select name="quantite" className="form-select" id="quantite" defaultValue={1}>
              {[...Array(10).keys()].map(n => <option key={n + 1} value={n + 1}>{n + 1}</option>)}
            </select>
          </div>

          <div className="col-12">
            <label className="visually-hidden" htmlFor="unite">Unit??</label>
            <select name="unite" className="form-select" id="unite" defaultValue={"boite"}>
              {units.map(unit => <option key={unit.id} value={unit.referenceValue}>{unit.referenceValue}</option>)}
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Ajouter</button>
          </div>
        </form>
        <div className="mt-3 mb-3">
          <div className="input-group">
            <input name="search" className="form-control" id="search" placeholder="Rechercher un produit (saisir 3 caract??res)" autoComplete="off" onChange={searchProduct} />
          </div>
        </div>
        {showTable && <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th className="d-none d-md-table-cell" scope="col">#</th>
                <th className="d-none d-md-table-cell" scope="col">Date ajout</th>
                <th className="d-none d-md-table-cell" scope="col">Date M??J</th>
                <th scope="col">Produit</th>
                <th scope="col">Quantit??</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {produits.sort((p, q) => p.id - q.id).map((p, index) => (<tr key={p.id}>
                <th className="d-none d-md-table-cell" scope="row">{p.id}</th>
                <td style={{ wordWrap: 'break-word', minWidth: '1rem', maxWidth: '4rem' }} className="d-none d-md-table-cell">{new Date(p.creationDate).toLocaleString()}</td>
                <td style={{ wordWrap: 'break-word', minWidth: '1rem', maxWidth: '4rem' }} className="d-none d-md-table-cell">{p.lastUpdateDate ? new Date(p.lastUpdateDate).toLocaleString() : '-'}</td>
                <td style={{ wordWrap: 'break-word', minWidth: '1rem', maxWidth: '6rem' }}>{p.productName} {p.remainingQuantity === 0 && <span className="badge bg-danger">??puis??</span>}</td>
                <td>
                  <div className="input-group">
                    <div className="col-7">
                      <input type="text" disabled className="form-control" value={`${p.remainingQuantity} ${p.unit}`} />
                    </div>
                    <button className="btn btn-primary" type="button" onClick={() => ajouter(p, 1)}>+</button>
                    {p.remainingQuantity > 0 && <button className="btn btn-primary" type="button" onClick={() => ajouter(p, -1)}>-</button>}
                  </div>

                </td>
                <td style={{ wordWrap: 'break-word', minWidth: '1rem', maxWidth: '1rem' }}><button type="button" onClick={() => handleDelete(p)} className="btn btn-danger">Suppr.</button></td>
              </tr>))}
            </tbody>
          </table>
          {loading && <div className="text-center"><div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
          </div></div>}
          {!loading && produits.length === 0 && <p>Aucun produit dans la liste</p>}
        </div>}
        {showCards && <div className="row">
          {produits.map((p, index) => (<div className="col-6 col-md-2">
            <Card
              warning={p.remainingQuantity === 0}
              productName={p.productName}
              quantity={`${p.remainingQuantity} ${p.unit}`}
              addOne={() => ajouter(p, 1)}
              removeOne={() => ajouter(p, -1)}
              deleteProduct={() => handleDelete(p)}
            />
          </div>))}
        </div>}
      </div>
    </>
  );
}

export default App;
