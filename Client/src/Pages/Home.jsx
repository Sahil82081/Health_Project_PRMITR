import React from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { useStateContext } from '../Provider/StateProvider'
import TabSwitcher from '../Components/TabSwitcher'
import SymptomChecker from '../Components/Symptom_checker/SymptomChecker'
import { useSymptomChecker } from '../hooks/useSymptomChecker'
import Scanner_Tab from '../Components/Skin_scanner/Scanner_Tab'
import { useDermScan } from '../hooks/useSkinScanner'
import { useState } from 'react'

function Home() {
    const { darktheme, toggleTheme } = useStateContext()
    const [activeTab, setActiveTab] = React.useState('chatbot')
    const [showDoctorModal, setShowDoctorModal] = useState(false);
    const symptomState = useSymptomChecker();
    const dermScanState = useDermScan();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-navy-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
            <Header darktheme={darktheme} toggleTheme={toggleTheme} />

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">

                {/* Core Tab Navigation */}
                <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Feature 1: Symptom Checker AI Chatbot */}

                {activeTab === 'chatbot' && (
                    <SymptomChecker symptomState={symptomState} />
                )}
                {activeTab === 'dermscan' && (
                    <Scanner_Tab
                        dermScanState={dermScanState}
                        onOpenDoctorModal={() => setShowDoctorModal(true)} />
                )}

            </main>
            <Footer />
        </div>
    )
}

export default Home