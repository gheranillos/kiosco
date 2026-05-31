import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Términos y condiciones — El Kiosco",
  description:
    "Condiciones que rigen la compra de productos y el uso de wearekiosco.com.",
};

export default function TerminosYCondicionesPage() {
  return (
    <LegalLayout title="Términos y condiciones" lastUpdated="30/05/2026">
      <p>
        Estos términos regulan la compra de productos a través de{" "}
        <a
          href="https://wearekiosco.com"
          className="underline hover:text-stone-900"
        >
          wearekiosco.com
        </a>{" "}
        y el uso de este sitio. Léelos con calma antes de hacer un pedido — al
        comprar nos confirmas que los aceptas.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        1. Quiénes somos
      </h2>
      <p>
        <strong>El Kiosco</strong> es una marca independiente de ropa
        venezolana. Diseñamos drops limitados, hechos por artistas para
        outsiders. Puedes escribirnos por WhatsApp al{" "}
        <a
          href="https://wa.me/584147613621"
          className="underline hover:text-stone-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          +58 414 7613621
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
        2. Cómo funciona la compra
      </h2>
      <p>
        Navegas el catálogo, eliges talla, agregas al carrito y pasas al
        checkout. Allí seleccionas el método de pago, completas tus datos de
        envío y confirmas. Recibirás un correo o mensaje de confirmación de
        pedido. Esa confirmación no implica aceptación automática: el contrato
        de venta se considera formalizado cuando confirmamos el despacho del
        pedido.
      </p>
      <p>
        Nos reservamos el derecho a rechazar un pedido si:
      </p>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>Detectamos un error evidente en el precio o en la información del producto.</li>
        <li>No hay stock disponible.</li>
        <li>Los datos suministrados son incompletos o falsos.</li>
        <li>Hay indicios de que el pedido es fraudulento o especulativo.</li>
      </ul>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        3. Antes de comprar, entiende esto
      </h2>
      <p>
        Kiosco no es ropa hecha en masa. Es ropa hecha por artistas para gente
        que no encaja. Cada drop es limitado. Cada pieza tiene intención. Si
        llegaste tarde… ya fue.
      </p>
      <p className="text-stone-900 font-semibold">No somos una marca normal:</p>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>No producimos en volumen infinito.</li>
        <li>No repetimos diseños por presión.</li>
        <li>No seguimos tendencias.</li>
      </ul>
      <p className="text-stone-900 font-semibold">Reglas claras:</p>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>Todos los drops son limitados.</li>
        <li>No garantizamos reposición de productos.</li>
        <li>No realizamos cambios por talla.</li>
        <li>Solo aplican cambios por defectos de fábrica.</li>
        <li>Los precios pueden cambiar sin previo aviso.</li>
      </ul>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        4. Precios y pagos
      </h2>
      <p>
        Todos los precios están expresados en dólares estadounidenses (USD).
        Los precios pueden actualizarse en cualquier momento, pero los cambios
        no afectan a pedidos con confirmación de envío ya emitida.
      </p>
      <p>Métodos de pago disponibles:</p>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>
          <strong>PayPal</strong> (pago automático).
        </li>
        <li>
          <strong>Zinli</strong>, <strong>Pago móvil</strong> y{" "}
          <strong>Binance Pay</strong> (pago manual con verificación de
          comprobante).
        </li>
      </ul>
      <p>
        En los pagos manuales, el pedido queda en estado pendiente hasta que
        verifiquemos el comprobante. Si el comprobante no es válido, el pedido
        se cancela y los productos vuelven a estar disponibles.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        5. Envíos
      </h2>
      <p>
        Hacemos envíos a nivel nacional (Venezuela). Trabajamos principalmente
        con MRW y Zoom. El tiempo de entrega estimado es de 2 a 5 días hábiles,
        y puede variar en fechas pico o por factores externos a nosotros.
      </p>
      <p>
        No nos hacemos responsables por retrasos de las empresas de envío una
        vez que el paquete ha sido despachado.
      </p>
      <p>
        Es responsabilidad del cliente proveer una dirección completa y un
        teléfono de contacto válido. Si el paquete vuelve a nuestro inventario
        por dirección errónea o falta de respuesta, el reenvío implica un
        nuevo costo de envío.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        6. Cambios y devoluciones
      </h2>
      <p>
        Como las piezas son de edición limitada, <strong>no hacemos cambios
        por talla</strong>. Te recomendamos revisar la guía de tallas antes de
        confirmar tu pedido.
      </p>
      <p>
        Aceptamos devoluciones solo en los siguientes casos:
      </p>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>El producto llega con defecto de fábrica.</li>
        <li>Recibiste un producto distinto al que pediste.</li>
      </ul>
      <p>
        En esos casos, escríbenos por WhatsApp dentro de los 7 días siguientes
        a la entrega con fotos del producto. Si el caso aplica, gestionamos la
        reposición o el reembolso. El producto debe regresar en las mismas
        condiciones en que se entregó.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        7. Cupones y promociones
      </h2>
      <p>
        Podemos ofrecer cupones, códigos de descuento o promociones puntuales.
        Cada uno tiene sus propias condiciones (fecha de vigencia, productos
        aplicables, monto mínimo, etc.) que se comunican al momento de su
        emisión. Nos reservamos el derecho de modificar, suspender o cancelar
        cualquier promoción cuando haya razones justificadas.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        8. Propiedad intelectual
      </h2>
      <p>
        Todos los diseños, prints, fotografías, logos y contenido del sitio
        son propiedad de El Kiosco o de los artistas con quienes colaboramos.
        Comprar una prenda no te otorga ningún derecho sobre su diseño ni
        sobre el contenido del sitio.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        9. Limitación de responsabilidad
      </h2>
      <p>
        Nuestra responsabilidad sobre cualquier producto comprado se limita al
        precio pagado por el mismo. No nos hacemos responsables por daños
        indirectos, pérdida de oportunidad o cualquier otro perjuicio derivado
        del uso del producto o del sitio.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        10. Fuerza mayor
      </h2>
      <p>
        No seremos responsables por retrasos o incumplimientos derivados de
        causas fuera de nuestro control razonable: cortes eléctricos, fallas
        en internet, restricciones gubernamentales, conflictos sociales,
        desastres naturales, problemas con proveedores de logística o pago,
        entre otros.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        11. Modificaciones
      </h2>
      <p>
        Podemos actualizar estos términos cuando lo consideremos necesario.
        La versión vigente es siempre la publicada en esta página. Los cambios
        no aplican retroactivamente a pedidos confirmados con condiciones
        anteriores.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        12. Ley aplicable y jurisdicción
      </h2>
      <p>
        Estos términos se rigen por las leyes de la República Bolivariana de
        Venezuela. Cualquier controversia se someterá a los tribunales con
        jurisdicción en Venezuela, sin perjuicio de los derechos que la ley
        reconoce a los consumidores.
      </p>
    </LegalLayout>
  );
}
