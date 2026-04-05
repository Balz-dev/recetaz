import { render, screen, waitFor } from "@testing-library/react";
import DemoSlugPage from "./page";
import { useRouter, useParams } from "next/navigation";
import { buscarPreset } from "@/lib/demo-presets";
import { navigation } from "@/shared/utils/navigation";

// Mocks de Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock del servicio de presets
jest.mock("@/lib/demo-presets", () => ({
  buscarPreset: jest.fn(),
}));

// Mocks para las dependencias dinámicas
jest.mock("@/shared/utils/seed", () => ({
  seedDatabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/shared/utils/navigation", () => ({
  navigation: {
    redirect: jest.fn(),
    reload: jest.fn(),
  },
}));

jest.mock("@/shared/db/db.config", () => ({
  db: {
    plantillas: {
      clear: jest.fn().mockResolvedValue(undefined),
      add: jest.fn().mockResolvedValue(undefined),
    },
  },
}));

describe("DemoSlugPage Funcionalidad Principal", () => {
  const mockRouter = {
    replace: jest.fn(),
    push: jest.fn(),
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("1. Debería redirigir a /demo si no hay slug presente en los parámetros", () => {
    (useParams as jest.Mock).mockReturnValue({});

    render(<DemoSlugPage />);

    expect(mockRouter.replace).toHaveBeenCalledWith("/demo");
  });

  it("2. Debería hacer fallback a /demo si el preset no existe (JSON no encontrado)", async () => {
    (useParams as jest.Mock).mockReturnValue({ slug: "slug-inexistente" });
    (buscarPreset as jest.Mock).mockResolvedValue(null);

    render(<DemoSlugPage />);

    expect(screen.getByText("Preparando Demo")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Configuración "slug-inexistente" no encontrada/i)).toBeInTheDocument();
    });

    jest.advanceTimersByTime(1500);

    expect(navigation.redirect).toHaveBeenCalledWith("/demo");
  });

  it("3. Debería inicializar el entorno y redirigir al dashboard con preset válido", async () => {
    const mockPreset = {
      slug: "ginecologia-pro",
      etiqueta: "Ginecología Pro",
      doctor: { especialidadKey: "ginecologia" },
      recetaConfig: { formato: "carta" },
    };

    (useParams as jest.Mock).mockReturnValue({ slug: "ginecologia-pro" });
    (buscarPreset as jest.Mock).mockResolvedValue(mockPreset);

    render(<DemoSlugPage />);

    expect(screen.getByText("Preparando Demo")).toBeInTheDocument();

    await waitFor(() => {
      expect(localStorage.getItem("recetaz_is_demo")).toBe("true");
      expect(localStorage.getItem("recetaz_demo_slug")).toBe("ginecologia-pro");
      expect(screen.getByText("¡Listo! Redirigiendo al dashboard...")).toBeInTheDocument();
    });

    jest.advanceTimersByTime(1000);

    expect(navigation.redirect).toHaveBeenCalledWith("/dashboard?demo=true");
  });

  it("4. Debería mostrar un mensaje de error y el botón de reintento si falla la inicialización", async () => {
    (useParams as jest.Mock).mockReturnValue({ slug: "slug-problematico" });
    (buscarPreset as jest.Mock).mockRejectedValue(new Error("Error interno simulado"));

    render(<DemoSlugPage />);

    await waitFor(() => {
      expect(screen.getByText("Error en la demo")).toBeInTheDocument();
      expect(screen.getByText(/Error al cargar la configuración/i)).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole("button", { name: "Reintentar" });
    expect(retryBtn).toBeInTheDocument();

    retryBtn.click();
    expect(navigation.reload).toHaveBeenCalled();
  });
});
