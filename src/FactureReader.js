import { useState } from 'react';
import { resizeMe } from './utils';
import { createWorker } from "tesseract.js";

function FactureReader() {
    const [img, setImg] = useState(null);
    const [imgCompressed, setImgCompressed] = useState(null);
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

    const onSubmit = (t) => {
        t.preventDefault();
        const reader = new FileReader();
        let compressed_image;
        let user_image = new Image();

        reader.onload = () => {
            console.log('reader onload');
            const readerResult = reader.result;
            user_image.src = readerResult;

        };

        reader.onloadend = () => {
            const config = {
                lang: "fr",
                oem: 1,
                psm: 3,
            }
            console.log('reader loadend');

            compressed_image = resizeMe(user_image);
            console.log(compressed_image);
            document.getElementById("result_image").src = compressed_image;
            document.getElementById("image_size").innerHTML = compressed_image.length / 1024 + "Ko";


            const worker = createWorker({
                logger: m => document.getElementById("percent").innerHTML = m.progress * 100 + "%"
            });

            (async () => {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(compressed_image);
                document.getElementById("ocr_result").innerHTML = text;
                await worker.terminate();
            })();
        }

        reader.readAsDataURL(t.target.user_image.files[0]);

    }
    return <div>
        <form onSubmit={onSubmit}>
            <div className="mb-3">
                <label for="formFile" className="form-label">Image</label>
                <input className="form-control" type="file" name="user_image" id="user_image" />
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-primary mb-3">Envoyer</button>
            </div>
        </form>
        <p id="percent"></p>
        <img src="" id="result_image" />
        <p id="image_size"></p>
        <p id="ocr_result"></p>
    </div>
}

export default FactureReader;