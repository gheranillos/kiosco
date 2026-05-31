import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Política de privacidad — El Kiosco",
  description:
    "Cómo recolectamos, usamos y protegemos tus datos personales en wearekiosco.com.",
};

export default function PoliticaDePrivacidadPage() {
  return (
    <LegalLayout title="Política de privacidad" lastUpdated="30/05/2026">
      <p>
        Tu privacidad nos importa. Esta política explica qué datos recogemos
        cuando interactúas con El Kiosco, para qué los usamos y qué derechos
        tienes sobre ellos.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        1. Quién es responsable
      </h2>
      <p>
        El responsable del tratamiento de tus datos es <strong>El Kiosco</strong>,
        marca independiente de ropa con sede en Venezuela. Puedes contactarnos
        por WhatsApp al{" "}
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
        2. Qué datos recogemos
      </h2>
      <p>Solo recogemos los datos que necesitamos para operar. Pueden incluir:</p>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>
          <strong>Lista de espera y preregistro:</strong> nombre, correo
          electrónico, WhatsApp, Instagram, ciudad y talla de interés.
        </li>
        <li>
          <strong>Compras (cuando esté habilitado):</strong> nombre y apellido,
          correo, teléfono, dirección de envío, ciudad, estado, código postal y
          método de pago seleccionado.
        </li>
        <li>
          <strong>Pagos:</strong> identificadores de transacción de PayPal,
          referencias de Zinli, pago móvil o Binance Pay, y comprobantes
          subidos por ti.
        </li>
        <li>
          <strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo y
          datos de navegación básicos a través de cookies y herramientas de
          analítica.
        </li>
      </ul>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        3. Para qué los usamos
      </h2>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>Avisarte cuando salga el próximo drop o haya novedades importantes.</li>
        <li>Procesar y enviar tus pedidos.</li>
        <li>Verificar pagos manuales (Zinli, Binance, pago móvil) y comprobantes.</li>
        <li>Atender consultas y resolver incidencias.</li>
        <li>Mejorar el sitio y entender qué funciona y qué no.</li>
      </ul>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        4. Base legal
      </h2>
      <p>
        Tratamos tus datos con base en tu consentimiento (cuando te suscribes a
        la lista de espera o al newsletter) y en la ejecución del contrato
        (cuando compras un producto). Cumplimos también con las obligaciones
        legales aplicables en Venezuela.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        5. Con quién compartimos datos
      </h2>
      <p>
        No vendemos tus datos. Solo los compartimos con proveedores que
        necesitamos para operar:
      </p>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>
          <strong>Supabase</strong> — base de datos donde guardamos registros y
          pedidos.
        </li>
        <li>
          <strong>Vercel</strong> — hosting del sitio web y métricas básicas.
        </li>
        <li>
          <strong>PayPal</strong> — para procesar pagos cuando eliges esa
          opción.
        </li>
        <li>
          <strong>Empresas de mensajería</strong> (MRW, Zoom Envíos, etc.) — para
          entregar pedidos.
        </li>
        <li>
          <strong>Autoridades</strong> — cuando una ley nos obligue a hacerlo.
        </li>
      </ul>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        6. Cuánto tiempo guardamos los datos
      </h2>
      <p>
        Conservamos tus datos mientras tengas un vínculo activo con nosotros
        (suscripción, pedido en curso, garantía vigente) y durante los plazos
        legales aplicables. Después se eliminan o se anonimizan.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        7. Tus derechos
      </h2>
      <p>Tienes derecho a:</p>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>Pedir acceso a los datos que tenemos sobre ti.</li>
        <li>Corregir datos incorrectos o incompletos.</li>
        <li>Pedir que borremos tus datos cuando ya no sean necesarios.</li>
        <li>Retirar el consentimiento que nos diste para tratarlos.</li>
        <li>
          Oponerte al uso de tus datos para finalidades de marketing en
          cualquier momento.
        </li>
      </ul>
      <p>
        Para ejercer cualquiera de estos derechos, escríbenos por WhatsApp o
        Instagram con tu nombre, correo y el derecho que quieres ejercer. Te
        respondemos en los días siguientes.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        8. Cookies y analítica
      </h2>
      <p>
        Usamos cookies estrictamente necesarias para que el sitio funcione y
        herramientas de analítica anonimizada (Vercel Analytics) para entender
        cómo se usa el sitio. No usamos cookies de publicidad de terceros.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        9. Seguridad
      </h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger
        tus datos (cifrado en tránsito, control de accesos, copias de
        seguridad). Aun así, ninguna plataforma es 100% segura — si detectas
        un incidente, avísanos cuanto antes.
      </p>

      <h2 className="pt-4 text-lg font-bold uppercase text-stone-900">
        10. Cambios a esta política
      </h2>
      <p>
        Si actualizamos esta política, te avisaremos publicando la nueva versión
        en esta página con la fecha de la última actualización. Si los cambios
        son importantes, también lo notificaremos por correo a quienes estén
        en la lista de espera.
      </p>
    </LegalLayout>
  );
}
