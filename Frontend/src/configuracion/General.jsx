import React from "react";
import { Bell, Globe } from "lucide-react";
import { useSettings } from "../contexto/ConfiguracionContexto";
import toast from "react-hot-toast";

const General = () => {
  const { settings, setSettings } = useSettings();

  const handleToggle = (key) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      if (key === "notifications") {
        toast(
          newSettings.notifications
            ? "Notificaciones activadas"
            : "Notificaciones desactivadas",
          {
            icon: newSettings.notifications ? "🔔" : "🔕",
          }
        );
      }
      return newSettings;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">
        Configuración General
      </h2>
      <div className="space-y-6">
        {/* Notificaciones */}
        <div className="bg-[#1E2837] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-[#7152EC]" />
              <span className="font-medium text-gray-200">Notificaciones</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.notifications}
                onChange={() => handleToggle("notifications")}
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer 
                peer-checked:after:translate-x-full peer-checked:bg-[#7152EC] 
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                after:bg-gray-200 after:border-gray-300 after:border 
                after:rounded-full after:h-5 after:w-5 after:transition-all"
              ></div>
            </label>
          </div>
        </div>

        {/* Idioma */}
        <div className="bg-[#1E2837] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-[#7152EC]" />
            <span className="font-medium text-gray-200">Idioma</span>
          </div>
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings({ ...settings, language: e.target.value })
            }
            className="w-full p-2 bg-[#00132e] text-gray-200 border border-gray-700 
              rounded-md focus:outline-none focus:ring-2 focus:ring-[#7152EC] 
              focus:border-[#7152EC]"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default General;