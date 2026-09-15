import { useState } from 'react';
import axios from 'axios';
export function useDermScan() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [imageFile, setImageFile] = useState(null);


  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDermScan = async() => {
        if (!imageFile || isAnalyzingImage) return;

    try {
        setIsAnalyzingImage(true);
        setScanResult(null);

        const formData = new FormData();

        formData.append("image", imageFile);

        const response = await axios.post(
            "http://localhost:8000/api/analyze",
            formData
        );

        console.log("Result from server:", response.data);

        setScanResult(response.data);

    } catch (error) {
        console.error("Scan error:", error);

        setScanResult({
            error: "Unable to analyze image"
        });

    } finally {
        setIsAnalyzingImage(false);
        setImageFile(null);
        setSelectedImage(null);
    }

    // setTimeout(() => {
    //   setScanResult({
    //     condition: 'Atopic Dermatitis (Eczema Patch)',
    //     confidence: 88,
    //     severity: 'Low Urgency',
    //     riskScore: 32,
    //     traits: [
    //       'Localized Erythema (Redness)',
    //       'Subtle Epidermal Flaking / Scaling',
    //       'Well-demarcated Margins',
    //       'Zero Nodular Ulceration'
    //     ],
    //     recommendations: [
    //       'Apply gentle emollients or hydrocortisone 1% topical cream twice daily',
    //       'Avoid perfumed soaps and prolonged hot water exposure',
    //       'Consult a qualified dermatologist if rash spreads or develops weeping'
    //     ]
    //   });
    //   setIsAnalyzingImage(false);
    // }, 2000);
  };

//   const handleSelectSampleImage = (sample) => {
//     setSelectedImage(sample.url);
//     setSelectedRegion(sample.region);
//     setScanResult(null);
//   };

  return {
    selectedImage,
    isAnalyzingImage,
    scanResult,
    handleImageUpload,
    handleDragOver,
    handleDrop,
    handleRunDermScan,
  };
}
