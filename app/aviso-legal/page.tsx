import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Aviso legal — El Kiosco",
  description: "Información legal sobre El Kiosco y el uso de wearekiosco.com.",
};

export default function AvisoLegalPage() {
  return (
    <LegalLayout title="Aviso legal" lastUpdated="30/05/2026">
      <h2 className="pt-2 text-lg font-bold uppercase text-stone-900">
        1. Datos identificativos
      </h2>
      <p>
        Este sitio web —{" "}
        <a href="https://wearekiosco.com" className="underline hover:text-stone-900">
          wearekiosco.com
        </a>{" "}
        — es propiedad de <strong>El Kiosco</strong>, marca independiente de ropa
        venezolana. Para cualquier consulta puedes escribirnos a{" "}
        <a
          href="https://wa.me/584147613621"
          className="underline hover:text-stone-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          +58 414 7613621 (WhatsApp)
        </a>{" "}
        o por Instagram en{" "}
        <a
          href="https://instagram.com/wearekiosco"
          className="underline hover:text-stone-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          @wearekiosco
        </a>
        .
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        2. Objeto del sitio
      </h2>
      <p>
        El Kiosco utiliza este sitio para presentar sus drops de ropa, capturar
        registros de lista de espera y, cuando esté habilitado, gestionar la
        venta de prendas limitadas hechas por artistas para outsiders.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        3. Uso del sitio
      </h2>
      <p>
        Al navegar este sitio aceptas hacerlo de buena fe, dándole un uso
        conforme a la ley, al orden público y a la buena costumbre. Está
        prohibido:
      </p>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>Realizar pedidos falsos, especulativos o fraudulentos.</li>
        <li>Intentar acceder a áreas restringidas o saltarse medidas de seguridad.</li>
        <li>Suplantar identidad, usar bots o scrapear el sitio sin autorización.</li>
        <li>
          Revender productos como originales fuera de los canales autorizados de
          El Kiosco.
        </li>
      </ul>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        4. Propiedad intelectual
      </h2>
      <p>
        Todo el contenido del sitio (logos, fotografías, diseños, prints, textos
        y código) pertenece a El Kiosco o a sus autores y está protegido por
        leyes de propiedad intelectual. No puedes copiar, reproducir,
        retransmitir ni usar comercialmente ningún elemento sin permiso por
        escrito.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        5. Enlaces externos
      </h2>
      <p>
        Este sitio puede contener enlaces a sitios de terceros (Instagram,
        TikTok, X, plataformas de pago, etc.). No nos hacemos responsables del
        contenido ni de las políticas de privacidad de esos sitios.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        6. Responsabilidad
      </h2>
      <p>
        Hacemos lo posible por mantener el sitio operativo y la información
        actualizada, pero no garantizamos disponibilidad ininterrumpida ni
        ausencia total de errores. El Kiosco no será responsable por daños
        indirectos, pérdida de datos o lucro cesante derivados del uso del
        sitio.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        7. Modificaciones
      </h2>
      <p>
        Nos reservamos el derecho de modificar este aviso legal y los contenidos
        del sitio en cualquier momento. Las modificaciones rigen desde el
        momento en que se publican en esta página.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        8. Legislación aplicable
      </h2>
      <p>
        Las relaciones derivadas del uso del sitio se rigen por las leyes de la
        República Bolivariana de Venezuela. Cualquier controversia se resolverá
        ante los tribunales competentes con jurisdicción en Venezuela.
      </p>
    </LegalLayout>
  );
}
