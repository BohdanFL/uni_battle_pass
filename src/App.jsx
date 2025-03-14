import { useState } from "react";
import GamePass from "./GamePass";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
function App() {
    return (
        <Provider>
            <GamePass />
            <Toaster />
        </Provider>
    );
}

export default App;
